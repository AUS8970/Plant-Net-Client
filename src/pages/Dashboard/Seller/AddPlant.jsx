import { Helmet } from 'react-helmet-async'
import AddPlantForm from '../../../components/Form/AddPlantForm'
import { imageUpload } from '../../../api/utlis';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';
import { useState } from 'react';

const AddPlant = () => {

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [ loading, setLoading ] = useState(false);

  // handle form submt
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;
    const name = form.name.value;
    const description = form.description.value;
    const category = form.category.value;
    const price = parseFloat(form.price.value);
    const quantity = parseInt(form.quantity.value);
    const image = form.image.files[0];

    // create image url by iamge upload api
    const imageUrl = await imageUpload(image);

    // seller info
    const seller = {
      name: user?.displayName,
      image: user?.photoURL,
      email: user?.email,
    }

    // create plant data object
    const plantData = {
      name,
      category,
      description,
      price,
      quantity,
      image: imageUrl,
      seller,
    }

    console.table(plantData);

    try {
      await axiosSecure.post('/plants', 
      plantData)
      toast.success('Data Added Successfully');
    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div>
      <Helmet>
        <title> Add Plant | Dashboard </title>
      </Helmet>

      {/* Form */}
      <AddPlantForm 
        handleSubmit={handleSubmit} 
        loading={loading}
      />
    </div>
  )
}

export default AddPlant
