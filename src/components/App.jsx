import { Vortex } from 'react-loader-spinner';
import toast, { Toaster } from 'react-hot-toast';
import { Component } from "react";
import { Searchbar } from "./Searchbar/Searchbar";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { Button } from "./Button/Button.jsx";
import { fechServisSearchImg } from "./API";
import { Container } from './Container/Container.styled';
import { ContainerLoader } from './ContainerLoader/ContainerLoader';


export class App extends Component {
  
state= {
gallery:[],
searchValue:"",
page: 1,
isLoading: false,
error: false,
loadMore: false
}
uppdateSearchbar = (searchName)=> {
    this.setState(() => ({
      searchValue: searchName,
      gallery: [],
      page: 1,
      loadMore: false, 

    }));
  };
handlerButton = ()=> {
  this.setState(prevState => ({ page: prevState.page + 1 }));
  }
async componentDidUpdate(prevProps, prevState) {

  const { searchValue, page } = this.state;
  try {
      if ((prevState.searchValue !== searchValue) || page !== prevState.page) {

      this.setState({ isLoading: true, error: false });
      const searchImg = await fechServisSearchImg(searchValue, page);
console.log(searchImg)
      toast.success("Images found successfully!")

      this.setState({
        gallery: page === 1 ? searchImg.hits : [...prevState.gallery, ...searchImg.hits],
        isLoading: false, 
        error: false,
        loadMore: this.state.page < Math.ceil(searchImg.totalHits / 12)

      });
    }
  } catch (error) {
    this.setState({ error: true, isLoading: false }); 
  }
  }
 render () {
    const { gallery, isLoading, error, loadMore }= this.state;

   return <Container>
     <Searchbar onSubmit={this.uppdateSearchbar} />
     {gallery.length > 0 && <ImageGallery galleryImages={gallery} />}

     {isLoading && <ContainerLoader>
       <Vortex
         visible={true}
         height="80"
         width="80"
         ariaLabel="vortex-loading"
         wrapperStyle={{}}
         wrapperClass="vortex-wrapper"
         colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
       />
     </ContainerLoader>}
   {loadMore &&  <Button onClickButton ={this.handlerButton}/> } 

  {error && <span>Whoops... Error! Please, reload this page!</span>}
  <Toaster  position="top-right" /> 
  </Container>
  } 
};