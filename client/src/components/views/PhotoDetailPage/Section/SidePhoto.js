import Axios from 'axios'
import React, { useEffect , useState} from 'react'
const {IP} = require('../../../../config/Backend_IP')
const {PORT} = require('../../../../config/Backend_Port')


function SidePhoto() {
    const [sidePhotos, setsidePhotos] = useState([])
    useEffect(()=>{
        Axios.get('/api/photo/getPhotos')
        .then(response=>{
            if(response.data.success){
                //console.log(response.data)
                setsidePhotos(response.data.photos)
            }
            else{
                alert('비디오 가져오기를 실패했습니다.')
            }
        })
    },[])

    const renderSidePhoto = sidePhotos.map((photo,index)=>{

        
        return (<div key={index} style={{display:'flex',marginBottom:"1rem",padding:"0 2rem" }}>
            <div style={{width:"40%", marginRight: '1rem'}}>
                <a href={`/photo/${photo._id}`}>
                    <img style={{width:'100%', height: '100%'}} src={`http://${IP}:${PORT}/${photo.filePath}`} alt="filePath" />
                </a>
            </div>

            <div style={{width:"50%"}}>
                <a href={`/photo/${photo._id}`} style={{color:"gray"}}>
                    <span style={{fontSize:'1rem',color:'black'}}>{photo.title}</span><br />
                    <span>{photo.writer.name}</span><br />
                    <span>{photo.views} views</span><br />

                </a>
            </div>
        </div>)

    })


    return (

        <React.Fragment>
            <div style={{marginTop:'3rem'}} />
            {renderSidePhoto}
        </React.Fragment>

        
    )
}

export default SidePhoto
