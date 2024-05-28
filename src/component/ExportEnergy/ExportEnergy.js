import React, { useEffect, useRef, useState } from 'react';
import { TiFlowSwitch } from 'react-icons/ti';
import { useIntl } from 'react-intl';
import './ExportEnergy.scss';
import { useSelector } from 'react-redux';
import { userInfor } from '../../App';
import { Download, callApi } from '../Api/Api';
import { host } from '../Lang/Contant';
import moment from 'moment-timezone';
import { FaFileExcel } from 'react-icons/fa';
import fileDownload from 'js-file-download';
import { format, eachDayOfInterval } from 'date-fns';
import { isBrowser } from 'react-device-detect';

function ExportEnergy(props) {
    const dataLang = useIntl();
    const user = useSelector((state) => state.admin.usr)
    const [logger, setLogger] = useState([])
    const [list, setList] = useState([])
    const [dayofweek, setDayofweek] = useState(0)
    const [dailyCustom, setDailyCustom] = useState(true)
    const [reporttype, setReporttype] = useState('Day')

    const logger_ = useRef()
    const machine_ = useRef()
    const type_ = useRef()
    const date_ = useRef()
    const month_ = useRef()
    const from_ = useRef()
    const to_ = useRef()
    const datefrom_ = useRef()
    const dateto_ = useRef()


    const time = [
        '00:00:00', '00:30:00', '01:00:00', '01:30:00',
        '02:00:00', '02:30:00', '03:00:00', '03:30:00',
        '04:00:00', '04:30:00', '05:00:00', '05:30:00',
        '06:00:00', '06:30:00', '07:00:00', '07:30:00',
        '08:00:00', '08:30:00', '09:00:00', '09:30:00',
        '10:00:00', '10:30:00', '11:00:00', '11:30:00',
        '12:00:00', '12:30:00', '13:00:00', '13:30:00',
        '14:00:00', '14:30:00', '15:00:00', '15:30:00',
        '16:00:00', '16:30:00', '17:00:00', '17:30:00',
        '18:00:00', '18:30:00', '19:00:00', '19:30:00',
        '20:00:00', '20:30:00', '21:00:00', '21:30:00',
        '22:00:00', '22:30:00', '23:00:00', '23:30:00',
        '23:59:00'
    ]

    const Low = [
        '00:00:00', '00:30:00', '01:00:00', '01:30:00',
        '02:00:00', '02:30:00', '03:00:00', '03:30:00',
        '04:00:00', '22:00:00', '22:30:00', '23:00:00',
        '23:30:00', '23:59:00'
    ]

    const Mid_Week = [
        '04:00:00', '04:30:00', '05:00:00', '05:30:00',
        '06:00:00', '06:30:00', '07:00:00', '07:30:00',
        '08:00:00', '08:30:00', '09:00:00', '09:30:00',
        '11:30:00', '12:00:00', '12:30:00', '13:00:00',
        '13:30:00', '14:00:00', '14:30:00', '15:00:00',
        '15:30:00', '16:00:00', '16:30:00', '17:00:00',
        '20:00:00', '20:30:00', '21:00:00', '21:30:00',
        '22:00:00'
    ]

    const Mid_Weekend = [
        '04:00:00', '04:30:00', '05:00:00', '05:30:00',
        '06:00:00', '06:30:00', '07:00:00', '07:30:00',
        '08:00:00', '08:30:00', '09:00:00', '09:30:00',
        '10:00:00', '10:30:00', '11:00:00', '11:30:00',
        '12:00:00', '12:30:00', '13:00:00', '13:30:00',
        '14:00:00', '14:30:00', '15:00:00', '15:30:00',
        '16:00:00', '16:30:00', '17:00:00', '17:30:00',
        '18:00:00', '18:30:00', '19:00:00', '19:30:00',
        '20:00:00', '20:30:00', '21:00:00', '21:30:00',
        '22:00:00'
    ]

    const High = [
        '09:30:00', '10:00:00', '10:30:00', '11:00:00',
        '11:30:00', '17:00:00', '17:30:00', '18:00:00',
        '18:30:00', '19:00:00', '19:30:00', '20:00:00',
    ]

    useEffect(() => {

        const date = new Date();
        setDayofweek(date.getDay())

        const getAllLogger = async (usr, id, type) => {

            let res = await callApi("post", host.DATA + "/getAllLogger", {
                usr: usr,
                partnerid: id,
                type: type,
            })
            console.log(res)
            setLogger(res.data)
            if (res.status) {
                setLogger(res.data)
            }
        }

        getAllLogger(user, userInfor.value.partnerid, userInfor.value.type)
    }, [])

    const handleReport = async (e) => {
        console.log(e.target.id)
        let res = await callApi("post", host.DATA + "/getreportTime", {
            id: e.target.id
        })

        console.log(res)
        logger_.current = e.target.id
        setList(res)

    }

    const handleType = async (e) => {
        console.log(e.target.value)
        if (e.target.value === 'custom') {
            setDailyCustom(true)
        } else {
            setDailyCustom(false)
        }
    }


    const exportExcelDaily = async (e) => {
        // console.log(logger_.current, machine_.current.value,reporttype, moment(date_.current.value).format('MM/DD/YYYY'), type_.current.value, from_.current.value, to_.current.value)
        // console.log(gateway, report, machine.current.value, moment(date.current.value).format('MM/DD/YYYY'), type_time.current.value, from.current.value, to.current.value)
        if (list.length > 0) {
            var i = list.findIndex(d => d.code === machine_.current.value);
            console.log(list[i])
            console.log(type_.current.value)
            if (type_.current.value === "custom") {
                if (Date.parse(`${moment(date_.current.value).format('MM/DD/YYYY')} ${from_.current.value}:00`) < new Date() && Date.parse(`${moment(date_.current.value).format('MM/DD/YYYY')} ${to_.current.value}:00`) < new Date()) {
                    if (Date.parse(`${moment(date_.current.value).format('MM/DD/YYYY')} ${from_.current.value}:00`) <= Date.parse(`${moment(date_.current.value).format('MM/DD/YYYY')} ${to_.current.value}:00`)) {
                        const newData = time.filter((item) => item >= from_.current.value && item <= to_.current.value)
                        console.log(newData)
                        let res = await Download(host.DATA + "/ReportDaily", {
                            deviceid: logger_.current,
                            code: machine_.current.value,
                            name: list[i].name,
                            register: list[i].register,
                            date: moment(date_.current.value).format('MM/DD/YYYY'),
                            time: newData,
                            type: type_.current.value
                        })

                        console.log(res)
                        if (res.type === 'application/json') {

                        } else {
                            fileDownload(res, `Daily_All_${list[i].name}_${moment(date_.current.value).format('MMDDYYYY')}.xlsx`)
                        }
                        // axios.post(host.DEVICE + "/ReportDaily", { deviceid: gateway, code: machine.current.value, name: reportm.value[i].name, register: reportm.value[i].register, date: moment(date.current.value).format('MM/DD/YYYY'), time: newData, type: type_time.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                        //     (res) => {
                        //         console.log(res.data)
                        //         if (res.data.type === 'application/json') {
                        //             alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
                        //         } else {
                        //             fileDownload(res.data, `Daily_All_${reportm.value[i].name}_${moment(date.current.value).format('MMDDYYYY')}.xlsx`)
                        //         }
                        //     }
                        // )
                    } else {
                        console.log("to > from")
                        // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_46" }), show: 'block' }))

                    }
                } else {
                    console.log("Please compare with current time")
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_46" }), show: 'block' }))
                }
            }

            if (type_.current.value === 'high') {

                let res = await Download(host.DATA + "/ReportDaily", {
                    deviceid: logger_.current,
                    code: machine_.current.value,
                    name: list[i].name,
                    register: list[i].register,
                    date: moment(date_.current.value).format('MM/DD/YYYY'),
                    time: High,
                    type: type_.current.value
                })

                console.log(res)
                if (res.type === 'application/json') {

                } else {
                    fileDownload(res, `Daily_All_${list[i].name}_${moment(date_.current.value).format('MMDDYYYY')}.xlsx`)
                }
            }

            if (type_.current.value === 'mid') {

                let res = await Download(host.DATA + "/ReportDaily", {
                    deviceid: logger_.current,
                    code: machine_.current.value,
                    name: list[i].name,
                    register: list[i].register,
                    date: moment(date_.current.value).format('MM/DD/YYYY'),
                    time: (dayofweek === 0) ? Mid_Weekend : Mid_Week,
                    type: (dayofweek === 0) ? "custom" : type_.current.value
                })

                console.log(res)
                if (res.type === 'application/json') {

                } else {
                    fileDownload(res, `Daily_Mid_${list[i].name}_${moment(date_.current.value).format('MMDDYYYY')}.xlsx`)
                }

            }

            if (type_.current.value === 'low') {
                let res = await Download(host.DATA + "/ReportDaily", {
                    deviceid: logger_.current,
                    code: machine_.current.value,
                    name: list[i].name,
                    register: list[i].register,
                    date: moment(date_.current.value).format('MM/DD/YYYY'),
                    time: Low,
                    type: type_.current.value
                })

                console.log(res)
                if (res.type === 'application/json') {

                } else {
                    fileDownload(res, `Daily_Low_${list[i].name}_${moment(date_.current.value).format('MMDDYYYY')}.xlsx`)
                }

            }

        } else {
            console.log("bạn không có máy nào")
            // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
        }
    }


    const exportExcelMonth = async (e) => {
        // console.log(gateway, report, machine.current.value, moment(month.current.value).format('MM/YYYY'), type_month.current.value, datefrom.current.value, dateto.current.value)
        if (list.length > 0) {

            if (month_.current.value !== "") {
                var i = list.findIndex(d => d.code === machine_.current.value);
                console.log(list[i])
                if (new Date(datefrom_.current.value) <= new Date(dateto_.current.value)) {
                    const dateList = eachDayOfInterval({ start: new Date(datefrom_.current.value), end: new Date(dateto_.current.value) }).map((date) =>
                        format(date, 'MM/dd/yyyy')
                    );

                    console.log(dateList)

                    let res = await Download(host.DATA + "/ReportMonth", {
                        deviceid: logger_.current,
                        code: machine_.current.value,
                        name: list[i].name,
                        register: list[i].registermonth,
                        month: moment(month_.current.value).format('MM/YYYY'),
                        date: dateList,
                        type: type_.current.value
                    })
                    console.log(res)
                    if (res.type === 'application/json') {

                    } else {
                        fileDownload(res, `Month_${list[i].name}_${moment(month_.current.value).format('MMYYYY')}.xlsx`)
                    }

                    // axios.post(host.DEVICE + "/ReportMonth", { deviceid: gateway, code: machine_.current.value, name: list[i].name, register: list[i].registermonth, month: moment(month_.current.value).format('MM/YYYY'), date: dateList, type: type_.current.value }, { responseType: 'blob' }, { secure: true, reconnect: true }).then(
                    //     (res) => {
                    //         console.log(res.data)
                    //         if (res.data.type === 'application/json') {
                    //             alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))

                    //         } else {
                    //             fileDownload(res.data, `Month_${reportm.value[i].name}_${moment(month.current.value).format('MMYYYY')}.xlsx`)

                    //         }
                    //     }
                    // )
                } else {
                    // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_47" }), show: 'block' }))
                }

            } else {
                // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_48" }), show: 'block' }))
            }

        } else {
            console.log("bạn không có máy nào")
            // alertDispatch(action('LOAD_CONTENT', { content: dataLang.formatMessage({ id: "alert_31" }), show: 'block' }))
        }
    }




    return (
        <>
            <div className="DAT_ExportHeader">
                <div className="DAT_ExportHeader_Title">
                    <TiFlowSwitch color="gray" size={25} />
                    <span>
                        {dataLang.formatMessage({ id: 'export' })}
                    </span>
                </div>
            </div>

            <div className="DAT_Export"
                style={{ height: isBrowser ? "calc(100vh - 130px)" : "calc(100vh - 210px)" }}
            >
                <div className="DAT_Export_Left">
                    <div className="DAT_Export_Left_Tit" >Thiết bị</div>
                    <div className="DAT_Export_Left_Box"
                        style={{ height: isBrowser ? "calc(100vh - 180px)" : "calc(100vh - 260px)" }}
                    >
                        {
                            logger.map((item, i) => {
                                return (
                                    <div key={i} className="DAT_Export_Left_Box_Item">
                                        <div className="DAT_Export_Left_Box_Item_SN" id={item.sn_} onClick={(e) => handleReport(e)} >{item.sn_}</div>
                                        <div className="DAT_Export_Left_Box_Item_Name">{item.name_}</div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
                <div className="DAT_Export_Right" >
                    <div className="DAT_Export_Right_Tit" >Xuất báo cáo</div>
                    <div className="DAT_Export_Right_Box">

                        <div className="DAT_Export_Right_Box_Item">
                            <div className="DAT_Export_Right_Box_Item_Name">Máy</div>
                            <select ref={machine_}>
                                {list.map((data, index) => {
                                    return (
                                        <option key={index} value={data.code}>{data.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="DAT_Export_Right_Box_Item">
                            <div className="DAT_Export_Right_Box_Item_Name">Loại báo cáo</div>
                            <select onChange={(e) => setReporttype(e.target.value)} >

                                <option value="Day">Báo cáo ngày</option>
                                <option value="Month">Báo cáo tháng</option>

                            </select>
                        </div>

                        {(() => {
                            switch (reporttype) {
                                case "Day":
                                    return <>
                                        <div className="DAT_Export_Right_Box_Item">
                                            <div className="DAT_Export_Right_Box_Item_Name">
                                                Ngày
                                            </div>
                                            <input type="date" ref={date_} defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} />
                                        </div>


                                        <div className="DAT_Export_Right_Box_Item">
                                            <div className="DAT_Export_Right_Box_Item_Name">
                                                Khung giờ
                                            </div>

                                            <select ref={type_} onChange={(e) => handleType(e)}>
                                                <option value="custom" >Tùy chỉnh</option>
                                                <option value="high" style={{ display: dayofweek === 0 ? 'none' : 'block' }}>Giờ cao điểm</option>
                                                <option value="mid">Giờ bình thường</option>
                                                <option value="low">Giờ thấp điểm</option>
                                            </select>
                                        </div>

                                        {(dailyCustom)
                                            ? <div className="DAT_Export_Right_Box_Item" >
                                                <div className="DAT_Export_Right_Box_Item_Name">Từ</div>

                                                <select ref={from_} >
                                                    {time.map((item, index) => {
                                                        return <option key={index} value={item} >{item}</option>;
                                                    })}
                                                </select>


                                                <div className="DAT_Export_Right_Box_Item">
                                                    <div className="DAT_Export_Right_Box_Item_Name">Đến</div>
                                                    <select ref={to_} >
                                                        {time.map((item, index) => {
                                                            return <option key={index} value={item}>{item}</option>;
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            : <></>
                                        }

                                        <div className="DAT_Export_Right_Box_Item">

                                            <div className="DAT_Export_Right_Box_Item_Export" onClick={(e) => exportExcelDaily(e)}>
                                                <span>
                                                    Xuất File
                                                </span>
                                                &nbsp;
                                                <FaFileExcel size={24} style={{ color: "white" }} />
                                            </div>
                                        </div>
                                    </>
                                case "Month":
                                    return <>
                                        <div className="DAT_Export_Right_Box_Item">
                                            <div className="DAT_Export_Right_Box_Item_Name">
                                                Tháng
                                            </div>
                                            <input type="month" ref={month_} defaultValue={moment(new Date()).format("YYYY-MM")} max={moment(new Date()).format("YYYY-MM-DD")} />
                                        </div>

                                        <div className="DAT_Export_Right_Box_Item">
                                            <div className="DAT_Export_Right_Box_Item_Name">
                                                Khung giờ
                                            </div>

                                            <select ref={type_} onChange={(e) => handleType(e)}>
                                                <option value="custom" >Tùy chỉnh</option>
                                                <option value="high" >Giờ cao điểm</option>
                                                <option value="mid">Giờ bình thường</option>
                                                <option value="low">Giờ thấp điểm</option>
                                            </select>
                                        </div>

                                        <div className="DAT_Export_Right_Box_Item">
                                            <div className="DAT_Export_Right_Box_Item_Name" >Từ:</div>
                                            <input style={{ marginRight: "10px" }} ref={datefrom_} type="date" defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} />
                                        </div>

                                        <div className="DAT_Export_Right_Box_Item">
                                            <div className="DAT_Export_Right_Box_Item_Name">Đến:</div>
                                            <input type="date" ref={dateto_} defaultValue={moment(new Date()).format("YYYY-MM-DD")} max={moment(new Date()).format("YYYY-MM-DD")} />
                                        </div>

                                        <div className="DAT_Export_Right_Box_Item" onClick={(e) => exportExcelMonth(e)} >

                                            <div className="DAT_Export_Right_Box_Item_Export">
                                                <span>
                                                    Xuất File
                                                </span>
                                                &nbsp;
                                                <FaFileExcel size={24} style={{ color: "white" }} />
                                            </div>
                                        </div>

                                    </>
                                default:
                                    return <></>
                            }
                        })()}


                    </div>
                </div>
            </div>
        </>
    );
}

export default ExportEnergy;