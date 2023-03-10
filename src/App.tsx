import './App.css'
import { useEffect, useState } from 'react'
import { useDispatch,useSelector } from './components/hooks'
import { getGallery, incrementPage,decrementPage } from './redux/GallerySlice'
import Filters from './components/Filters'
import Loader from './components/Loader'
import MyDialog from './components/MyDialog'
import FullPost from './components/FullPost'


function App() {
  const dispatch = useDispatch()
  const [dialogData,setDialogData]=useState(null);

  const { photos, pageLoading, filters } = useSelector((state) => ({
    photos: state.gallery.photos,
    pageLoading: state.gallery.pageLoading,
    filters: state.gallery.filters,
  }))

  useEffect(() => {
    dispatch(getGallery())
  }, [filters])

  const getPostImages = () => {
    if (photos.length == 0) return []
    let newGallery = [] as any

    photos.forEach((post:any) => {
      let imageData = post?.images?.find((dataImg) => {
        let link = dataImg?.link?.split('.')
        if (!link) return false
        let checkExtension =
          link[link.length - 1] === 'jpg' ||
          link[link.length - 1] === 'png' ||
          link[link.length - 1] === 'gif' ||
          link[link.length - 1] === 'jpeg'

        return checkExtension
      })
      // console.log({ imageData })
      if (imageData) {
        newGallery.push({ ...post, link: imageData?.link })
      }
    })

    return newGallery
  }

  const postImages = getPostImages()
  return (
    <div className="">
      <MyDialog dialogData={dialogData} setDialogData={setDialogData}>
        <FullPost post={dialogData} />
      </MyDialog>
      <Filters />
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="container px-5 py-2 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {postImages.map((post:any) => {
              return (
                <div key={post?.id} className="flex flex-col" onClick={()=>{setDialogData(post)}}>
                  <img
                    alt="gallery"
                    className="block object-cover object-center w-full h-full rounded-t-lg min-h-[150px] max-h-[400px]"
                    src={post?.link ?? ''}
                  />
                  <div className="bg-[#474a51] py-2 px-3 text-white max-h-[150px]">
                    {post?.title ?? ''}
                  </div>
                </div>
              )
            })}
          </div>
          <div className='flex gap-2 justify-end mt-4 pt-4 border-t-2 text-white'>
              <button onClick={()=>{dispatch(decrementPage());window.scrollTo(0, 0)}} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Previous</button>
              <button onClick={()=>{dispatch(incrementPage());window.scrollTo(0, 0)}} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
