import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";

import { db, storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ManageBuku() {

    const [toggleCard, setToggleCard] = useState(false)
    const [onCloseCard, setOnCloseCard] = useState(false)

    const [search, setSearch] = useState('')
    const [tabelLoading, setTabelLoading] = useState(false)

    const [bukuData, setbukuData] = useState([])
    const [typeForm, setTypeForm] = useState('')
    const [dataForm, setDataForm] = useState({
        judul: '',
        penulis: '',
        deskripsi: '',
        bahasa: 'Indonesia',
        jumlah_dipinjam: 0,
        jumlah_halaman: 0
    })
    const [file, setFile] = useState(null)

    function closeCard() {
        setOnCloseCard(true)
        setTimeout(() => {
            const form = [{}]

            setDataForm(form)
            setOnCloseCard(false)
            setToggleCard(false)
        }, 240);
    }

    function formHandle(e) {
        const name = e.target.name
        const value = e.target.value
        setDataForm({
            ...dataForm,
            [name]: value
        })
    }

    function fileHandle(e) {
        setFile(e.target.files[0])
    }

    function DisplayBuku() {
        let filteredData = bukuData;

        const buku = filteredData.map((i, no) =>
            <tr key={no}>
                <td>{no + 1}</td>
                <td>{i.judul}</td>
                <td>{i.penulis}</td>
                <td>{i.bahasa}</td>
                <td><img src={i.gambar} alt={i.judul} width="160" height="200" loading="lazy" /></td>
                <td>
                    <button className="btn-edit" onClick={() => { setToggleCard(true); getOneBuku(i.id); setTypeForm('edit') }}>Edit</button>
                    <button className="btn-hapus" onClick={() => deletebuku(i.id)}>Hapus</button>
                </td>
            </tr>
        );

        return buku;
    }

    async function getBuku() {
        try {
            setTabelLoading(true)
            onSnapshot(query(collection(db, 'buku'), orderBy('time', 'asc')), snapshot => {
                const tempData = []
                snapshot.forEach((data) => {
                    tempData.push({ ...data.data(), id: data.id })
                })
                setbukuData(tempData)
            })
            setTimeout(() => {
                setTabelLoading(false)
            }, 500);
        } catch (error) {
            console.log(error)
            setTabelLoading(false)
        }
    }

    async function getOneBuku(id) {
        try {
            const refDoc = doc(db, 'buku', id)
            const data = await getDoc(refDoc)
            setDataForm({ ...data.data(), id: data.id })

        } catch (error) {
            console.log(error)
        }
    }

    async function postBuku() {
        try {
            const alert = await swal({
                icon: 'warning',
                title: 'Apakah data sudah benar?',
                buttons: ['Belum', 'Sudah']
            })
            if (alert) {

                const storageRef = ref(storage, `buku/${file.name}`)
                await uploadBytes(storageRef, file)
                const getLink = await getDownloadURL(storageRef)

                await addDoc(collection(db, "buku"), {
                    ...dataForm,
                    gambar: getLink,
                    dipinjam: false,
                    time: Timestamp.now().toMillis()
                })

                swal({
                    icon: 'success',
                    title: 'Berhasil upload buku',
                    button: false,
                    timer: 1200
                })
                setFile(null)
                closeCard()
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function updateBuku(id) {
        console.log(id)
    }

    useEffect(() => {
        getBuku()
    }, [])

    return (
        <>
            {toggleCard && (<Form className={`${onCloseCard ? 'close-animation' : ''}`} >
                <div className="formCLose"><i className="bi bi-x-lg close-icon" onClick={() => closeCard()}></i></div>
                <div className="formBody">

                    <div className="form-group">
                        <label htmlFor="judul" className="form-label">Judul: </label>
                        <input type="text" name="judul" id="judul" className="form-input" placeholder="Masukkan judul" autoComplete="off" value={dataForm.judul} onChange={(e) => formHandle(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="penulis" className="form-label">Penulis: </label>
                        <input type="text" name="penulis" id="penulis" className="form-input" placeholder="Jhon Doe" autoComplete="off" value={dataForm.penulis} onChange={(e) => formHandle(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="deskripsi" className="form-label">Deskripsi: </label>
                        <input type="text" name="deskripsi" className="form-input" autoComplete="off" value={dataForm.deskripsi} onChange={(e) => formHandle(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="bahasa" className="form-label">Bahasa: ({dataForm.bahasa}) </label>
                        <select name="bahasa" id="bahasa" className="form-input" onChange={(e) => formHandle(e)}>
                            <option value="-">-</option>
                            <option value="arabic">Arabic</option>
                            <option value="bengali">Bengali</option>
                            <option value="bulgarian">Bulgarian</option>
                            <option value="catalan">Catalan</option>
                            <option value="chinese">Chinese</option>
                            <option value="croatian">Croatian</option>
                            <option value="czech">Czech</option>
                            <option value="danish">Danish</option>
                            <option value="dutch">Dutch</option>
                            <option value="english">English</option>
                            <option value="estonian">Estonian</option>
                            <option value="filipino">Filipino</option>
                            <option value="finnish">Finnish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                            <option value="greek">Greek</option>
                            <option value="hebrew">Hebrew</option>
                            <option value="hindi">Hindi</option>
                            <option value="hungarian">Hungarian</option>
                            <option value="icelandic">Icelandic</option>
                            <option value="indonesian">Indonesian</option>
                            <option value="italian">Italian</option>
                            <option value="japanese">Japanese</option>
                            <option value="korean">Korean</option>
                            <option value="latvian">Latvian</option>
                            <option value="lithuanian">Lithuanian</option>
                            <option value="malay">Malay</option>
                            <option value="norwegian">Norwegian</option>
                            <option value="persian">Persian</option>
                            <option value="polish">Polish</option>
                            <option value="portuguese">Portuguese</option>
                            <option value="romanian">Romanian</option>
                            <option value="russian">Russian</option>
                            <option value="serbian">Serbian</option>
                            <option value="slovak">Slovak</option>
                            <option value="slovenian">Slovenian</option>
                            <option value="spanish">Spanish</option>
                            <option value="swedish">Swedish</option>
                            <option value="thai">Thai</option>
                            <option value="turkish">Turkish</option>
                            <option value="ukrainian">Ukrainian</option>
                            <option value="urdu">Urdu</option>
                            <option value="vietnamese">Vietnamese</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="jumlah_dipinjam" className="form-label">Jumlah dipinjam: </label>
                        <input type="number" name="jumlah_dipinjam" className="form-input" readOnly value={dataForm.jumlah_dipinjam} onChange={(e) => formHandle(e)} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="jumlah_halaman" className="form-label">Jumlah halaman: </label>
                        <input type="number" name="jumlah_halaman" className="form-input" value={dataForm.jumlah_halaman} onChange={(e) => formHandle(e)} />
                    </div>
                    <div className="form-group">
                        <input type="file" className="form-input file" onChange={(e) => fileHandle(e)} />
                    </div>
                </div>
                <div className="formSubmit">
                    { typeForm === 'create' && (<button className="btn-submit" onClick={() => postBuku()}>Create</button>)}
                    { typeForm === 'edit' && (<button className="btn-submit" onClick={() => updateBuku(dataForm.id)}>Update</button>)}
                </div>
            </Form>)}
            <Card className={`${toggleCard ? 'blur' : ''}`}>
                <Filter>
                    {/* Manage user tidak butuh create button */}
                    <button onClick={() => {setToggleCard(true); setTypeForm('create')}}>Create</button>
                    <input type="text" placeholder="Cari buku atau penulis..." onChange={(e) => setSearch(e.target.value)} />
                    <select>
                        <option value="terbaru">Terbaru</option>
                        <option value="tersedia">Tersedia</option>
                        <option value="dipinjam">Dipinjam</option>
                    </select>
                </Filter>
                <TabelContainer>
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Judul</th>
                                <th>Penulis</th>
                                <th>Bahasa</th>
                                <th>Gambar</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabelLoading && (<tr>
                                <td>Loading</td>
                                <td>Loading</td>
                                <td>Loading</td>
                                <td>Loading</td>
                                <td>Loading</td>
                                <td>Loading</td>
                            </tr>)}
                            <DisplayBuku></DisplayBuku>
                        </tbody>
                    </table>
                </TabelContainer>
            </Card>
        </>
    );
}


const FormToggle = keyframes`
  0%{ 
    width:400px;
    height:500px;
  }
  50%{
    width:410px;
    height:510px;
  }
  100%{
    width:400px;
    height:500px;
  }
`

const closeAnimation = keyframes`
  0%{ 
    width:400px;
    height:500px;
  }
  50%{
    width:410px;
    height:510px;
  }
  100%{
    width:0px;
    height:0px;
  }
`

const Card = styled.div`
  width:100%;
  height:100%;

  &.blur{
    filter:blur(3px);
  }
`;

const Filter = styled.div`
  // border:1px solid green; 
  width:100%;
  height:20%;
  display:flex;
  justify-content:space-around;
  align-items:center;

  button{
    border:none;
    border-radius:50px;
    width:10%;
    height:60%;
    background-color:#222831;
    color:white;
    font-size:15px;
    cursor:pointer;
  }

  input{
    outline:none;
    border:none;
    border-radius:50px;
    background-color:#efefef;
    width:60%;
    height:60%;
    padding:0 20px;
    font-size:15px;
  }

  select{
    border:none;
    border-radius:50px;
    width:10%;
    height:60%;
    background-color:#222831;
    color:white;
    padding:0 10px;
    cursor:pointer;
    appearance:none;
    text-align:center;
    font-size:15px;
  }

  @media only screen and (max-width:700px){
    button{
      width:20%;
    }

    select{
      display:none;
    }
  }
`;

const TabelContainer = styled.div`
  width: 95%;
  height: 80%;
  overflow-y: auto;
  margin:0 auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
  }

  th, td {
    padding: 12px 15px;
    text-align: left;
  }

  th {
    background-color: #222831;
    color: white;
    font-weight: bold;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }

  tr:hover {
    background-color: #ddd;
  }

  td {
    border-bottom: 1px solid #ddd;
  }

  .btn-edit{
    border:none;
    border-radius:5px 0 0 5px;
    padding:10px 15px;
    background-color:#222831;
    color:white;
    cursor:pointer;
  }
  
  .btn-hapus{
    border:none;
    border-radius:0 5px 5px 0;
    padding:10px 15px;
    background-color:#222831;
    color:white;
    cursor:pointer;
  }

  .btn-edit:hover, .btn-hapus:hover{
    background-color:#2b2f36;
  }
`;

const Form = styled.div`
  width:400px;
  height:500px;
  background-color:#efefef;
  position:absolute;
  z-index:10;
  top:50%;
  left:50%;
  transform:translate(-50%, -50%);
  box-shadow:0.5px 0 1px 0px rgba(0, 0, 0, 0.5);
  border-radius:10px;
  animation:${FormToggle} 0.2s;

  &.close-animation{
    animation:${closeAnimation} 0.3s;
  }

  .formCLose{
    width:100%;
    height:15%;
    display:flex;
    justify-content:flex-end;
    align-items:center;
  }

  .close-icon{
    margin-right:20px;
    font-size:30px;
    cursor: pointer;
  }

  .formBody{
    width:100%;
    height:70%;
    overflow-y:auto;
  }
  
  .formBody::-webkit-scrollbar{
    width:0px;
  }
  
  .form-group{
    width:90%;
    height:20%;
    display:flex;
    flex-direction:column;
    justify-content:space-around;
    align-items:flex-start;
    margin:0 auto;
    margin-bottom:15px;
  }

  .form-group .form-label{
    font-weight:bold;
  }
  .form-group .file{
    display:flex;
    justify-content:center;
    align-items:center;
  }

  .form-group .form-input{
    border:none;
    outline:none;
    width:90%;
    height:35px;
    padding:0 10px;
    font-size:15px;
    border-radius:5px;
    background-color:white;
  }

  .formSubmit{
    width:100%;
    height:15%;
    display:flex;
    justify-content:flex-end;
    align-items:center;
  }

  .btn-submit{
    margin-right:20px;
    border:none;
    border-radius:5px;
    padding:10px 25px;
    background-color:#222831;
    color:white;
    cursor:pointer;
  }
`