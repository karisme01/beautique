import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import '../../styles/Orders.css';
import { Modal, Input, Form, Button } from 'antd';
import { CiEdit } from "react-icons/ci";
import { IoAddOutline } from "react-icons/io5";


const AddressBook = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // To track editing address
  const [form] = Form.useForm();
  const [auth] = useAuth();

  useEffect(() => {
    fetchAddresses();
  }, [auth.user?._id]);

  const fetchAddresses = async () => {
    setLoading(true);
    const userId = auth.user?._id;
    try {
      const { data } = await axios.get(`/api/v1/admin/get-user-address/${userId}`);
      setAddresses(data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const editAddress = (index) => {
    const address = addresses[index];
    form.setFieldsValue(address);
    setShowAddAddressForm(true);
    setEditingIndex(index);
  };

  const handleCancel = () => {
    setShowAddAddressForm(false);
    form.resetFields();
    setEditingIndex(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const userId = auth.user?._id;
    const updatedAddress = form.getFieldsValue();

    try {
      if (editingIndex !== null) {
        addresses[editingIndex] = updatedAddress;
      } else {
        addresses.push(updatedAddress);
      }
      await axios.post(`/api/v1/admin/update-user-address/${userId}`, addresses);
      setShowAddAddressForm(false);
      form.resetFields();
      setEditingIndex(null);
      fetchAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Address Book">
      <div className='container p-3 m-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <div className='address-layout'>
              {loading ? <p>Loading addresses...</p> : 
              addresses.map((address, index) => (
                <div key={index} className="card mb-3" style={{ width: '100%', display: 'flex', flexDirection: 'row', 
                    backgroundColor: '#efefef', height: '60%', borderRadius: '0px'}}>
                  <div className="card-body" style={{ padding: '20px'}}>
                    <p style={{ margin: '4px 0' }}><strong>Street:</strong> {address.street}</p>
                    <p style={{ margin: '4px 0' }}><strong>City:</strong> {address.city}</p>
                    <p style={{ margin: '4px 0' }}><strong>State:</strong> {address.state}</p>
                    <p style={{ margin: '4px 0' }}><strong>Zip Code:</strong> {address.zipCode}</p>
                  </div>
                  <div style={{marginRight: '5px', marginTop: '10px'}}>
                    <Button onClick={() => editAddress(index)} style={{ marginRight: 8 }}><CiEdit style={{fontSize: '25px'}}/></Button>
                  </div>
                </div>
              ))}
              <div className='btn-container'>
                <Button style={{fontSize: '15px', backgroundColor: '#2a2727', color: 'white', height: '50px', width: '50%'}} 
                  onClick={() => { setShowAddAddressForm(true); setEditingIndex(null); form.resetFields(); }}>
                  <div style={{fontWeight: 'bold'}}>
                    ADD ADDRESS
                  </div>
                </Button>
              </div>
              </div>
             </div>
          </div>
        </div>
            <Modal
              title={`${editingIndex !== null ? 'Edit' : 'Add New'} Address`}
              open={showAddAddressForm}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                  Submit
                </Button>,
              ]}
            >
              <Form form={form} layout="vertical">
                <Form.Item
                  name="street"
                  label="Street"
                  rules={[{ required: true, message: 'Please input the street!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="City"
                  rules={[{ required: true, message: 'Please input the city!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="state"
                  label="State"
                  rules={[{ required: true, message: 'Please input the state!' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="zipCode"
                  label="Zip Code"
                  rules={[{ required: true, message: 'Please input the zip code!' }]}
                >
                  <Input />
                </Form.Item>
              </Form>
            </Modal>
    </Layout>
  );
};

export default AddressBook;
