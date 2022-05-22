import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FaCheckCircle } from "react-icons/fa"
import userApi from "../../api/userApi";
import styles from "./AccountAddress.module.css";

function AccountAddress() {

  // Danh sách các địa chỉ
  const [address, setAddress] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  // State input thêm địa chỉ mới
  const [newAddress, setNewAddress] = useState("")
  // State của địa chỉ đang update: {address, addressId}
  const [updateAddress, setUpdateAddress] = useState({})
  const currentUser = useSelector((state) => state.user.currentUser)

  useEffect(() => {
    // Call API lấy danh sách địa chỉ
    const fetchDataAddress = async () => {
        const res = await userApi.getAllAddressById(currentUser.userId)
        setAddress(res.data.address)
    }
    
    if (currentUser.userId) {
      fetchDataAddress()
    }
  }, [currentUser])

  const handleShowAddForm = () => {
    setShowAddForm(!showAddForm)
  }

  const handleSubmitAddNewAddress = async (e) => {
    e.preventDefault()
    const res = await userApi.addAddress(currentUser.userId, {address: newAddress})
    setShowAddForm(false)
    setAddress((preState) => {
      const newArray = [...preState]
      newArray.push({
        _id: res.data.address._id,
        address: res.data.address.address,
        isDefault: false
      })
      return newArray
    })
  }

  const handleSubmitUpdateAddress = async (e) => {
    e.preventDefault()
    const  { addressId, address } = updateAddress 
    if (addressId && address) {
      const res = await userApi.updateAddressById(currentUser.userId, addressId, {address})
      if (!res.error) {
        setAddress((preState) => {
          const newArray = [...preState]
          return newArray.map((item) => {
            return item._id === addressId ? {...item, address: address} : item
          })
        })
        setShowEditForm(false)
      }
    }
  }

  const handleDeleteAddress = async (e) => {
    const addressId = e.target.getAttribute('data-id')
    const res = await userApi.deleteById(currentUser.userId, addressId)
    if (!res.error) {
      setAddress((preState) => {
        const newArray = [...preState]
        return newArray.filter(item => item._id !== addressId)
      })
    }
  }

  const handleUpdateAddress = (e) => {
    const addressId = e.target.getAttribute('data-id')
    const address = e.target.getAttribute('data-address')
    setUpdateAddress({addressId, address})
    setShowEditForm(!showEditForm)
  }

  const handleUpdateDefaultAddress = async (e) => {
    const addressId = e.target.getAttribute('data-id')
    const res = await userApi.updateDefaultAddressById(currentUser.userId, addressId)
    if (!res.error) {
      setAddress((preState) => {
        const newArray = [...preState]
        return newArray.map((item) => {
          return item._id === addressId ? {...item, isDefault: true} : {...item, isDefault: false}
        })
      })
    }
  }

  return (
    <>
      <div className={styles.addressWrapper}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Địa chỉ</th>
              <th colSpan="3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {address && address.length > 0 ? address.map((item, index) => {
              return (<tr key={item._id}>
                        <td>{index}</td>
                        <td>
                          {item.address} {" "} {item.isDefault ? 
                            <button className={`bookstore-btn ${styles.btnCheck}`}>
                              <FaCheckCircle />
                            </button> : ''}
                        </td>
                        <td>
                          {!item.isDefault ? 
                            <Button data-id={item._id} onClick={handleUpdateDefaultAddress}>
                              Đặt làm mặc định
                            </Button> : ''}
                        </td>
                        <td>
                          <button className="btn btn-warning"
                           data-id={item._id} data-address={item.address} onClick={handleUpdateAddress}
                          >Sửa
                          </button>
                        </td>
                        <td>
                          <button className="btn btn-danger"
                           data-id={item._id} onClick={handleDeleteAddress}
                          >Xóa
                          </button>
                        </td>
                      </tr>)
            }) : (<tr><td colSpan={3}>Bạn chưa có địa chỉ giao hàng nào!</td></tr>)}
          
          </tbody>
        </Table>
      </div>

      {showEditForm && (
        <form onSubmit={handleSubmitUpdateAddress}>
          <div className={`form-group ${styles.formGroup}`}>
            <label className={styles.formLabel}>Địa chỉ</label>
            <input
              required
              type="text"
              name="updateAddress"
              className={`form-control ${styles.formControl}`}
              placeholder="Nhập địa chỉ mới"
              value={updateAddress.address}
              onChange={(e) => setUpdateAddress(preState => {
                return {
                  ...preState, address: e.target.value
                 }
              })}
            />
          </div>
          <button className={`bookstore-btn ${styles.submitBtn}`}
            data-id={updateAddress.addressId}
          >
            Xác nhận
          </button> 
      </form>
      )}


      <button className={`bookstore-btn ${styles.addAddressBtn}`} onClick={handleShowAddForm}>
        {showAddForm ? 'Hủy thêm' : 'Thêm địa chỉ'}
      </button> 

      {showAddForm && (
        <form onSubmit={handleSubmitAddNewAddress}>
          <div className={`form-group ${styles.formGroup}`}>
            <label className={styles.formLabel}>Nhập địa chỉ mới</label>
            <input
              required
              type="text"
              name="newAddress"
              className={`form-control ${styles.formControl}`}
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
          </div>
          <button className={`bookstore-btn ${styles.submitBtn}`}>
            Xác nhận
          </button> 
      </form>
      )}
    </>
  );
}

export default AccountAddress;
