import starImg from './star.png';
import avatar from './avatar.png';
import './App.sass';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('AAA');
  const [activeSubTab, setActiveSubTab] = useState('SENT');
  const [nameInfo, setNameInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [showNoItemsMessage, setShowNoItemsMessage] = useState(false);

  useEffect(() => {
    const fetchNameInfo = async () => {
      try {
        const response = await axios.get('https://evoteam-verasoft.github.io/data/summary.json');
        const data = response.data;
        setNameInfo(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNameInfo();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://evoteam-verasoft.github.io/data/orders.json');
        const data = response.data;
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);
  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  }

  const handleNewOrderClick = () => {
    setShowOverlay(true);
    setShowLoader(true);
  };

  const handleSubTabClick = (subTab) => {
    if (subTab === 'SENT') {
      setActiveSubTab('SENT');
    } else {
      setActiveSubTab('ERRORS');
      setIsLoading(true);
      setShowNoItemsMessage(false);
      setTimeout(() => {
        setIsLoading(false);
        setShowNoItemsMessage(true);
      }, 2000);
    }
  };
  const handleSort = (column) => {
    if (sortOrder && sortOrder.column === column) {
      setSortOrder({ column, order: sortOrder.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortOrder({ column, order: 'asc' });
    }
  };
  const sentOrders = orders?.orders_AAA?.sent ?? [];
  console.log(sentOrders);

  const sortedRows = sentOrders.sort((a, b) => {
    console.log(sortOrder);
    if (sortOrder) {
      if (sortOrder.column === 'sent_dt') {
        return sortOrder.order === 'asc' ? a.sent_dt.localeCompare(b.sent_dt) : b.sent_dt.localeCompare(a.sent_dt);
      } else if (sortOrder.column === 'subject') {
        return sortOrder.order === 'asc' ? a?.subject?.title?.localeCompare(b?.subject?.title) : b?.subject?.title?.localeCompare(a?.subject?.title);
      } else if (sortOrder.column === 'type') {
        return sortOrder.order === 'asc' ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
      } else if (sortOrder.column === 'order_id') {
        return sortOrder.order === 'asc' ? a.order_id.localeCompare(b.order_id) : b.order_id.localeCompare(a.order_id);
      }
    }
    return 0;
  });
  return (
    <div className="Page">
      {nameInfo && (
        <div className="Card">
          <div className="Name_New_Order">
            <div className="Name">
              <figure>
                <img src={starImg} alt="Star" className="Star_Icon" />
              </figure>
              <p>{`${nameInfo.first_name} ${nameInfo.last_name}`}</p>
            </div>
            <div className="New_Order">
              <input type="button" className="Order_Button" value="New Order" onClick={handleNewOrderClick} />
            </div>
          </div>
          <div className="Name_Info">
            <div className="User_Avatar">
              <div className="User_Avatar_Icon">
                <img src={avatar} alt="Avatar" />
              </div>
              <div className="User_Sex_Age">
                <p>{`${nameInfo.gender.toUpperCase()} - ${new Date().getFullYear() - new Date(nameInfo.birth_date).getFullYear()}`}</p>
              </div>
            </div>
            <div className="User_Info">
              <div className="info-item">
                <span className="info-icon icon-id"></span>
                <span className="info-text">{`#${nameInfo.id}`}</span>
              </div>
              <div className="info-item">
                <span className="info-icon icon-phone"></span>
                <span className="info-text">{nameInfo.mobile_phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon icon-telephone"></span>
                <span className="info-text">{`${nameInfo.work_phone} ext 1023`}</span>
              </div>
              <div className="info-item">
                <span className="info-icon icon-fax"></span>
                <span className="info-text">{nameInfo.home_phone}</span>
              </div>
              <div className="info-item">
                <span className="info-icon icon-email"></span>
                <span className="info-text">{nameInfo.email}</span>
              </div>
            </div>
            <div className="User_Activity">
              <div className="User_Activity_SMS_Title User_Activity_Title">90-DAY COMMUNICATION ACTIVITY</div>
              <div className="User_Activity_info">
                <div className="User_Activity_info_Status">
                  <p className="Activity_SMS_Count">{nameInfo.activity.sms}</p>
                  <p className="Bottom_Title">SMS</p>
                </div>
                <div className="User_Activity_info_Status">
                  <p className="Activity_SMS_Count">{nameInfo.activity.email}</p>
                  <p className="Bottom_Title">EMAIL</p>
                </div>
                <div className="User_Activity_info_Status">
                  <p className="Activity_SMS_Count">{nameInfo.activity.orders}</p>
                  <p className="Bottom_Title">ORDERS</p>
                </div>
              </div>
            </div>
            <div className="User_SMS_Status">
              <p className="User_Activity_SMS_Title">SMS Status</p>
              <p className="Activity_SMS_Count">{nameInfo.carrier_status.status}</p>
              <p className="Bottom_Title">SINCE {new Date(nameInfo.carrier_status.since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>

            </div>
          </div>
          <div className="Tabs">
            <div className={`Tab ${activeTab === 'A' ? 'active' : ''}`} onClick={() => handleTabClick('A')}>ORDERS A</div>
            <div className={`Tab ${activeTab === 'AA' ? 'active' : ''}`} onClick={() => handleTabClick('AA')}>ORDERS AA</div>
            <div className={`Tab ${activeTab === 'AAA' ? 'active' : ''}`} onClick={() => handleTabClick('AAA')}>ORDERS AAA</div>
            <div className={`Tab ${activeTab === 'B' ? 'active' : ''}`} onClick={() => handleTabClick('B')}>ORDERS B</div>
            <div className={`Tab ${activeTab === 'C' ? 'active' : ''}`} onClick={() => handleTabClick('C')}>ORDERS C</div>
          </div>
          {activeTab === 'AAA' &&
            <div className='Orders_info'>
              <div className="Sub_Tabs_Bar">
                <div className="Sub_Tabs">
                  <div className={`Sub_Tab ${activeSubTab === 'SENT' ? 'active_sub' : ''}`} onClick={() => handleSubTabClick('SENT')}>
                    SENT
                  </div>
                  <div className={`Sub_Tab ${activeSubTab === 'ERRORS' ? 'active_sub' : ''}`} onClick={() => handleSubTabClick('ERRORS')}>
                    ERRORS
                  </div>
                </div>
                <div className='Sub_Tabs_Title'>RECENT ORDERS</div>
              </div>
              {activeSubTab === 'SENT' && (
                <div className="Order_Table">
                  <div className="Order_Table_Header">
                    <div className={`Order_Table_Row_Date ${sortOrder && sortOrder.column === 'date' ? `sorted ${sortOrder.order}` : ''}`} onClick={() => handleSort('date')}>DATE & TIME</div>
                    <div className={`Order_Table_Row_Subject ${sortOrder && sortOrder.column === 'subject' ? `sorted ${sortOrder.order}` : ''}`} onClick={() => handleSort('subject')}>SUBJECT</div>
                    <div className={`Order_Table_Row_Communication_Type ${sortOrder && sortOrder.column === 'type' ? `sorted ${sortOrder.order}` : ''}`} onClick={() => handleSort('type')}>COMMUNICATION TYPE</div>
                    <div className={`Order_Table_Row_Order_Number ${sortOrder && sortOrder.column === 'orderNumber' ? `sorted ${sortOrder.order}` : ''}`} onClick={() => handleSort('orderNumber')}>ORDER#</div>
                    <div className="Order_Table_Row_Resend"></div>
                  </div>
                  {sortedRows.map((order, index) => (
                    <div className="Order_Table_Row" key={index}>
                      <div className="Order_Table_Row_Date">
                        <span>{new Date(`${order.sent_dt}T${order.sent_tm}`).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span>{new Date(`${order.sent_dt}T${order.sent_tm}`).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                      </div>
                      <div className="Order_Table_Row_Subject">
                        <span>{order.subject.title}</span>
                        <span>{order.subject.email}</span>
                      </div>
                      <div className="Order_Table_Row_Communication_Type">{order.type}</div>
                      <div className="Order_Table_Row_Order_Number">{order.order_id}</div>
                      <div className="Order_Table_Row_Resend"><span>RESEND</span></div>
                    </div>

                  ))}
                </div>

              )}
            </div>
          }
          {activeTab !== 'AAA' || activeSubTab !== 'SENT' ? (
            isLoading ? (
              <div className="No_Item">
                <div className="loader"></div>
              </div>
            ) : (
              showNoItemsMessage && <div className="No_Item">No items</div>
            )
          ) : null}


        </div>
      )
      }
      {showOverlay && (
        <div className="Overlay">
          {showLoader && <div className="Loader"></div>}
          <div className="Close_Button" onClick={() => {
            setShowOverlay(false);
            setShowLoader(false);
          }}>X</div>
        </div>
      )}
    </div >
  );
}

export default App;