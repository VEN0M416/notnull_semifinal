import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { incrementMessage } from "../../core/Slice";
import { api } from '../../core/api';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from "react";

export const SideBar = () => {
    const navigate = useNavigate();
    const messageId = useSelector((state)=>state.request.messageId);
    
    const isConnected = useSelector((state)=>state.isConnected);
    const dispatch = useDispatch();
    const [cookies] = useCookies(['sessionId']);
    let milliseconds = new Date().valueOf();
    /* let hours = Math.floor( milliseconds / (1000 * 60 * 60) ); */
    const requests = useSelector((state)=>state.request.requests);
    const [isAnimated, setAnimated] = useState(false);

    const clickTable = (broker) => { 
        navigate(`/brokers/${broker}`);
        const mess = {
            header: {
                messageNum: messageId,
                timestamp: milliseconds,
                sender: cookies.sessionId,
                receiver: broker
            },
            request: {
                command: "ctStatus"
            }
        }
        console.log(JSON.stringify(mess));
        api.post('/sendStatus', {message: JSON.stringify(mess)}).then((res)=>{

        });
        dispatch(incrementMessage());
    }

    useEffect(()=>{
        setAnimated(true)
    },[])

    return (
        <div className={`sideBarBefore ${isAnimated ? 'sideBarAfter' : ''} mt-16 sm:mt-4 m-4 sm:ml-0 md:m-5 md:ml-0 lg:m-6 lg:ml-0 w-full sm:w-6/12 lg:w-4/12 flex flex-col text-white border-[1px] border-gray-500 bg-gradient-to-br from-white/30 sm:rounded-none sm:rounded-r-xl rounded-xl to-white/20 backdrop-blur-md shadow-xl place-content-start text-center text-2xl`} >
            <p className="mx-1 mt-6 mb-4 ">Сервисы БИ</p>
            <b className="border-[1px] w-11/12 mx-auto border-gray-300"/>
            {
                (requests?.length > 0) && requests.map((item, index) => (
                    <div key={index}
                    className=" cursor-pointer hover:bg-white/20 mx-3 my-2 py-2 px-3 rounded-md font-normal"
                    onClick={()=>clickTable(item.header.sender)}    
                    >{item.header.sender}</div>
                ) )
            }
        </div>

    );
}