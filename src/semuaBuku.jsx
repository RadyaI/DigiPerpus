import { useEffect, useState } from 'react'

import './assets/semuabuku.css'
import Loader from './components/loader'
import Navbar from './components/navbar'
import Sidebar from './components/sidebar'
import Float from './components/protected/float'
import dataBuku from './db/databuku.json'

import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './config/firebase'

import { useNavigate } from 'react-router-dom'

export default function Semuabuku() {

    const route = useNavigate()
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('Terbaru')
    const [sidebarFilter, setSidebarFilter] = useState({
        basicFilter: '',
        selectedOption: ''
    })

    const [book, setBook] = useState([]);

    const [isLoading, setIsLoading] = useState(false)

    function goToDetail(judul) {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
            route(`/buku/d/${judul}`)
        }, 600);
    }

    function BookList() {
        
        let filteredBook = book;
    
        if (search !== '') {
            filteredBook = filteredBook.filter(i => 
                i.judul.toLowerCase().includes(search.toLowerCase()) || 
                i.penulis.toLowerCase().includes(search.toLowerCase())
            );
        }

        if (sidebarFilter.selectedOption === 'tersedia') {
            filteredBook = filteredBook.filter(i => i.dipinjam === false);
        }
    
        if (sidebarFilter.basicFilter === 'terbaru') {
            filteredBook = filteredBook.sort((a, b) => b.time - a.time);
        } else if (sidebarFilter.basicFilter === 'popular') {
            filteredBook = filteredBook.sort((a, b) => b.jumlah_dipinjam - a.jumlah_dipinjam);
        }
    
        const data = filteredBook.map((i, index) =>
            <div className="card" key={index} onClick={() => goToDetail(i.judul)}>
                <div className="img-cover"><img loading='lazy' width="160" height="200" src={i.gambar} alt="Buku" /></div>
                <div className="desc">
                    <div className="author"><small>{i.penulis} </small></div>
                    <div className="title">{i.judul}</div>
                    { i.dipinjam && (<div className="status"><small>Tidak tersedia</small></div>)}
                </div>
            </div>
        );
    
        return data;
    }
    

    async function getBuku() {
        try {
            const get = await getDocs(query(collection(db, 'buku'), orderBy('time', 'desc')))
            let tempData = []
            get.forEach((data) => {
                tempData.push({ ...data.data(), id: data.id })
            })
            setBook(tempData)
        } catch (error) {
            console.log(error)
        }
    }

    function handleValue(value) {
        setSidebarFilter(value)
    }

    useEffect(() => {
        getBuku()
    }, [])

    return (
        <>
            {isLoading && (<Loader></Loader>)}
            <Navbar></Navbar>
            <Float></Float>
            <div className="buku-container">
                <Sidebar value={handleValue}></Sidebar>
                <div className="content">
                    <div className="filter">
                        <input type="text" placeholder='Cari judul atau penulis...' onChange={(e) => setSearch(e.target.value)} />
                        <select onChange={(e) => setFilter(e.target.value)}>
                            <option value="terbaru">Terbaru</option>
                            <option value="tersedia">Tersedia</option>
                        </select>
                    </div>
                    <div className="buku-data">

                        <BookList></BookList>

                    </div>
                </div>
            </div>
        </>
    )
}