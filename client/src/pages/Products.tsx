import { Button, Select, TextInput } from '@mantine/core'
import React, {  useEffect, useState } from 'react'


const Products = () => {
    const companies = [
        "AMZ",
        "FLP",
        "SNP",
        "MYN",
        "AZO",
    ]
    const categories = [
        "Phone",
        "Computer",
        "TV",
        "Earphone",
        "Tablet",
        "Charger",
        "Mouse",
        "Keypad",
        "Bluetooth",
        "Pendrive",
        "Remote",
        "Speaker",
        "Headset",
        "Laptop",
        "PC",
    ]
    const [products, setProducts] = useState<[]>([])
    const [company, setCompany] = useState<string | null>('')
    const [category, setCategory] = useState<string | null>('')
    const [noofproducts, setNoOfProducts] = useState<number>(0)
    const [maxprice, setMaxPrice] = useState<number>(0)
    const [minprice, setMinPrice] = useState<number>(0)

    const handleNoOfProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNoOfProducts(Number(e.target.value))
    }

    const handleMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaxPrice(Number(e.target.value))
    }

    const handleMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMinPrice(Number(e.target.value))
    }

    const handleSearch = () => {
        if (!company && !category && !noofproducts && !maxprice && !minprice) {
            alert('Please enter all the fields')
            return
        }
        // /products/:companyName/:category?top=:top&minPrice=:min&maxPrice=:max
        fetch(`http://localhost:9876/products/${company}/${category}?top=${noofproducts}&minPrice=${minprice}&maxPrice=${maxprice}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProducts(data);
            })
            .catch(err => console.log(err));
    }

    const register = () => {
        fetch('http://localhost:9876/register')
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        // /products/:companyName/:category?top=:top&minPrice=:min&maxPrice=:max"
        register();
        console.log(`http://localhost:9876/products/${companies[0]}/${categories[0]}?top=${10}&minPrice=${1}&maxPrice=${10000}`)
        fetch(`http://localhost:9876/products/${companies[0]}/${categories[0]}?top=${10}&minPrice=${1}&maxPrice=${10000}`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setProducts(data);
            })
            .catch(err => console.log(err));
    }, [])

    return (
        <div className='w-screen h-full min-h-screen justify-center flex flex-col'>
            <div className='w-full p-10 grid grid-cols-4 gap-10 justify-center items-center '>
                <Select label='Company' placeholder='Select company' data={companies} name='company' value={company} onChange={setCompany} />
                <Select label='Category' placeholder='Select category' data={categories} name='category' value={category} onChange={setCategory} />
                <TextInput type='text' label='No of Products' placeholder='Enter no of products' value={noofproducts} onChange={handleNoOfProducts} />
                <TextInput type='text' label='Max Price' placeholder='Enter max price' value={maxprice} onChange={handleMaxPrice} />
                <TextInput type='text' label='Min Price' placeholder='Enter min price' value={minprice} onChange={handleMinPrice} />
            </div>
            <div className='w-full flex justify-center items-center'>
                <Button variant='filled' color='teal'>Search</Button>
            </div>
            <div className='w-full grid grid-cols-4 gap-4'>
                {products.map((product: any) => (
                    <div className='w-full h-96 bg-white rounded-lg shadow-md p-5'>
                        <div className='w-full h-3/4'>
                            <img src={product.image} alt={product.name} className='w-full h-full object-cover' />
                        </div>
                        <div className='w-full h-1/4 flex flex-col justify-center items-center'>
                            <h1>{product.name}</h1>
                            <h1>{product.price}</h1>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Products