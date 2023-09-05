
import SearchBar from '../components/Searchbar'
import Table from '../components/Table'
import Loader from '../components/Loader'
import Filter from '../components/Filter/Filter'
import Status from '../components/Filter/Status'
import React, { useEffect, useState } from 'react'
import productData from '../types'
import { selectBrand, selectCategory, selectEndRange, selectFilterStatus, selectQuery, selectStartRange } from '../slice/filter-slice'
import { useSelector } from 'react-redux'
import { HandleValidation, getProducts } from '../service'

function Dashboard(): React.JSX.Element {
  
    const searchParams = useSelector(selectQuery);
    const category = useSelector(selectCategory)
    const brand = useSelector(selectBrand)
    const start_range = useSelector(selectStartRange)
    const end_range = useSelector(selectEndRange)
    const isFiltered = useSelector(selectFilterStatus);
    const [lengthData, setlengthData] = useState<number>(0);
    const [entryState, setentryState] = useState<number>(1);

 
  const [skip, setSkip] = useState<number>(0);
  //const [counter, setCounter] = useState<number>(5);
  const limit: number = 5;
  const [allProducts, setAllProducts] = useState<productData[]>()

  const handlePrevPagination = () => {
    if (skip > 0) {
      setSkip(skip-5)
      setentryState(entryState-1)
    }
  }

  const handleNextPagination = () => {
    if (skip < lengthData-limit) {
      setSkip(skip+5)
      setentryState(entryState+1)
    }
  }

  useEffect(() => {

    const fetchData = async () => {
      let data = await getProducts(searchParams, 0, 0)
      setlengthData(data.length)
      setSkip(0)
      setentryState(1)
     }
  
     fetchData();
  
  }, [searchParams, isFiltered])
  

  useEffect(() => {

    if (isFiltered) {
      const fetchDataFiltered = async () => {
        let { filteredDataPagination, length } = await HandleValidation(searchParams, category, parseInt(start_range), parseInt(end_range), brand, skip, limit)
        setAllProducts(filteredDataPagination)
        setlengthData(length)
        //setentryState(1)
       
       }
    
       fetchDataFiltered();

    } else {
      const fetchData = async () => {
        let products = await getProducts(searchParams, skip, limit)
        setAllProducts(products)
       }
    
       fetchData();
       
    }
   
  }, [searchParams, isFiltered, category, brand, start_range, end_range, skip, limit])

  return (
    <div className="overflow-hidden p-4 sm:ml-64">
      <SearchBar />
      {(isFiltered) ? <Status /> : false }
      <Filter />

      {/* <Categories data={categories} /> */}
      { (allProducts) ? <Table data={allProducts}/> : <Loader />}
      <div className="fixed bottom-6 right-6">
        <span className='mr-5 text-xs'>Page {entryState} / {Math.ceil(lengthData/5)}</span>
        <button type="button" onClick={handlePrevPagination} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Previous</button>
        <button type="button" onClick={handleNextPagination} className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Next</button>
    </div>
    </div>
  )
}

export default Dashboard