import React, {Component} from 'react';
import VariantSelector from './VariantSelector';
import { Col, Modal, Button } from 'react-bootstrap'

class Product extends Component {
  constructor(props) {
    super(props);

    let defaultOptionValues = {};
    this.props.product.options.forEach((selector) => {
      defaultOptionValues[selector.name] = selector.values[0].value;
    });
    this.state = { 
      selectedOptions: defaultOptionValues,
      showModal: false,

     };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.findImage = this.findImage.bind(this);
  }
  handleClose(){
    this.setState({showModal: false})
  }
  handleOpen(){
    this.setState({showModal: true})
  }
  findImage(images, variantId) {
    const primary = images[0];

    const image = images.filter(function (image) {
      return image.variant_ids.includes(variantId);
    })[0];

    return (image || primary).src;
  }

  handleOptionChange(event) {
    const target = event.target
    let selectedOptions = this.state.selectedOptions;
    selectedOptions[target.name] = target.value;

    const selectedVariant = this.props.client.product.helpers.variantForOptions(this.props.product, selectedOptions)

    this.setState({
      selectedVariant: selectedVariant,
      selectedVariantImage: selectedVariant.attrs.image
    });
  }

  handleQuantityChange(event) {
    this.setState({
      selectedVariantQuantity: event.target.value
    });
  }

  render() {
    let variantImage = this.state.selectedVariantImage || this.props.product.images[0]
    let variant = this.state.selectedVariant || this.props.product.variants[0]
    let variantQuantity = this.state.selectedVariantQuantity || 1
    let variantSelectors = this.props.product.options.map((option) => {
      return (
        <VariantSelector
          handleOptionChange={this.handleOptionChange}
          key={option.id.toString()}
          option={option}
        />
      );
    });
    let popupModal = 
      <Modal show={this.state.showModal} onHide={this.handleClose.bind(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Product description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="product-desc" dangerouslySetInnerHTML={{ __html: this.props.product.descriptionHtml}}></div>
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose.bind(this)}>
            Close
          </Button>
          {/* <Button variant="primary" onClick={this.handleClose.bind(this)}>
            Save Changes
          </Button> */}
        </Modal.Footer>
      </Modal>
    // if(this.state.showModal === true){
    //   return(popupModal)
    // }else{
      return (
        <React.Fragment>
          {this.state.showModal ? popupModal : ''}
          <Col xs md={4} className="product-contents-wrapper">
      
          {this.props.product.images.length ? <img className="product-img" src={variantImage.src} alt={`${this.props.product.title} product shot`}/> : null}
          <h5 className="Product__title">{this.props.product.title}</h5>
          <span className="Product__price">${variant.price}</span>
          {variantSelectors}
          <label className="Product__option">
            Quantity
            <input className="Product__option-qty-style" min="1" type="number" defaultValue={variantQuantity} onChange={this.handleQuantityChange}></input>
          </label>
          <div onClick={this.handleOpen.bind(this)} className="show-details">Show details</div>
          <div className="shop-btn-wrapper">
            <div className="wrapper-wrapper-btn-align">
            <button className="Product__buy shop-button" onClick={() => this.props.addVariantToCart(variant.id, variantQuantity)}>Add to Cart</button>
            </div>
            
          </div>
          
        </Col>
        </React.Fragment>
      );
       
        
   
  }
}

export default Product;
