import { Menu, Transition } from '@headlessui/react'
import { useState } from 'react'
import { api } from '../core/api';
import { useCookies } from 'react-cookie';
import { useDispatch } from "react-redux";
import { cleanRequests } from '../core/Slice';


export default function DropLink() {
  const dispatch = useDispatch();
  const [isShowing, setIsShowing] = useState(false)
  const [cookies,, removeCookie] = useCookies(['sessionId', 'username']);
  const send = () => {
    api.post('/authorisation/logout', { sessionId: cookies.sessionId }).then((res) => {
      if (res.data.status === 'done') {
        console.log('success log out');
        removeCookie('sessionId', { path: '/', sameSite: 'Lax' });
        removeCookie('username', { path: '/', sameSite: 'Lax' });
        dispatch(cleanRequests());
        window.location.reload();
      }
    });
  }


  return (
    <div className="text-right z-10 cursor-pointer"
      onMouseEnter={() => setIsShowing(true)}
      onMouseLeave={() => setIsShowing(false)}>
      <Menu as="div" className="relative inline-block text-left text-black">
        <div>
          <div className={`bg-amber-500 h-9 flex justify-between rounded-full items-center max-w-full min-w-min ${cookies.username.length < 4 ? 'pl-3 w-[118px] ' : 'pl-1'}`}>
            <div to="/profile" className='mx-3'>{"" + cookies.username}</div>
            <Menu.Button className="z-10 inline-flex w-12">
              <img className="rounded-full" src='https://termosfera.su/wp-content/uploads/2022/04/2816616767_vubrbej.jpg' alt=''></img>
            </Menu.Button>
          </div>
        </div>

        <Transition
          show={isShowing}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="bg-amber-500 text-black absolute right-[-20px] transform -translate-x-1/2 w-20 rounded-b-md ">
            <div className="px-1 py-1">
              <Menu.Item>
                {() => (
                  <button
                    type="button"
                    onClick={send}
                    className='hover:bg-black/10 text-black group flex w-full items-center rounded-md px-2 py-2 text-sm my-1'
                  >Log out</button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu >
    </div >
  )
}

