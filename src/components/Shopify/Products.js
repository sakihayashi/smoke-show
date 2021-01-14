import React, { Component } from 'react';
import Product from './Product';
import { Row, Container } from 'react-bootstrap'

class Products extends Component {
  render() {
    let products = this.props.products.map((product) => {
      return (
        <Product
          addVariantToCart={this.props.addVariantToCart}
          client={this.props.client}
          key={product.id.toString()}
          product={product}
        />
      );
    });

    return (
      <div className="width-adj-shop">
        <Row>
          {products}
        </Row>
      </div>
      
    );
  }
}

export default Products;
