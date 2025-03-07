/* eslint-disable react/prop-types */
import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react'
import { Fragment, useState } from 'react'
import Button from '../Shared/Button/Button'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { useNavigate } from 'react-router-dom'

const PurchaseModal = ({ closeModal, isOpen, plant, refetch }) => {

  const navigate = useNavigate();

  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const { name, category, image, price, quantity, seller, description, _id } = plant;
  
  const [totalQuantity, setTotalQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(price);
  const [purchessInfo, setPurchessInfo] = useState({
    customer: {
      name: user?.displayName,
      email: user?.email,
      image: user?.photoURL,
    },
    plantId: _id,
    price: totalPrice,
    quantity: totalQuantity,
    seller: seller?.email,
    address: '',
    status: 'pending',
  });

  const handleQuantity = value => {
    if(value > quantity){
      setTotalQuantity(quantity)
      return toast.error('Quantity exceeds available stock!');
    }
    if(value <= 0){
      return toast.error('Quantity cannot be less then 1!');
    }
    setTotalQuantity(value);
    setTotalPrice(value * price);
    setPurchessInfo(prv => {
      return { 
        ...prv,
        quantity: value,
        price: value * price
      }
    })
  };

  const handlePurchess = async () => {
    console.table(purchessInfo);
    // post requrest to db
    try {
      // save data in db
      await axiosSecure.post(`/order`, purchessInfo)
      // decrease quantity in db from plantsCollection
      await axiosSecure.patch(`/palnt/quantity/${_id}`, { 
        quantityToUpdate: totalQuantity,
        status: 'decrease',
      });
      // show success message
      toast.success('Purchess successful!')
      // refetch data
      refetch();
      // navigate
      navigate('/dashboard/my-orders');
    } catch(err) {
      console.log(err);
    } finally {
      closeModal();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Review Info Before Purchase
                </DialogTitle>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Plant: {name} </p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'> Category: {category} </p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'> Customer: {user?.displayName} </p>
                </div>

                <div className='mt-2'>
                  <p className='text-sm text-gray-500'> Price: $ {price} </p>
                </div>
                <div className='mt-2'>
                  <p className='text-sm text-gray-500'>Available Quantity: {quantity} </p>
                </div>

                {/* Quantity Input field */}
                <div className='space-y-1 mt-1 text-sm'>
                  <label htmlFor='quantity' className='text-gray-500 mr-2'>
                    Quantity: 
                  </label>
                  <input
                    className='p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    value={totalQuantity}
                    onChange={(e) => handleQuantity(parseInt(e.target.value))}
                    name='quantity'
                    id='quantity'
                    type='number'
                    placeholder='Available quantity'
                    required
                  />
                </div>

                {/* Address Input field */}
                <div className='space-y-1 mt-1 text-sm'>
                  <label htmlFor='address' className='text-gray-500 mr-2'>
                    Address: 
                  </label>
                  <input
                    className='p-2 text-gray-800 border border-lime-300 focus:outline-lime-500 rounded-md bg-white'
                    name='address'
                    id='address'
                    onChange={(e) => setPurchessInfo(prv => {
                      return { 
                        ...prv,
                        address: e.target.value
                      }
                    })}
                    type='text'
                    placeholder='Type your address here...'
                    required
                  />
                </div>

                <div className='mt-2'>
                  <Button onClick={handlePurchess} className='' label={`Pay: ${totalPrice}`} />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PurchaseModal;