import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import api from '../api';

const ProductInformation = ({ navigation, route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleAccordion = index => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    console.log('Product ID received:', productId);
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product-info/${productId}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#DE576F" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Produk tidak ditemukan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-left" size={24} color="#DE576F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Detail</Text>
        <View style={{ width: 24 }} /> {/* Spacer kanan */}
      </View>

      <ScrollView style={styles.content}>
        {/* Section 1: Product Info */}
        <View style={styles.productSection}>
          <Image
            source={{
              uri: `${api.defaults.baseURL}${product.productImage}`,
            }}
            style={styles.productImage}
          />
          <Text style={styles.productName}>{product.productName}</Text>
          <Text style={styles.productBrand}>Brand: {product.productBrand}</Text>
          <Text style={styles.productType}>Type: {product.productType}</Text>
        </View>

        {/* Section 2: Ingredients */}
        <View style={styles.ingredientSection}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {product.Ingredients.map((ingredient, index) => {
            const isActive = activeIndex === index;
            return (
              <View key={index} style={styles.accordionWrapper}>
                <TouchableOpacity
                  style={[
                    styles.accordionHeader,
                    isActive && styles.activeHeaderOpen,
                    !isActive && styles.accordionHeaderClosed,
                  ]}
                  onPress={() => toggleAccordion(index)}
                >
                  <Text style={styles.accordionHeaderText}>
                    {ingredient.name}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={20}
                    color="#DE576F"
                    style={{
                      transform: [{ rotate: isActive ? '180deg' : '0deg' }],
                    }}
                  />
                </TouchableOpacity>
                {isActive && (
                  <View style={styles.accordionContent}>
                    <Text style={styles.accordionContentText}>
                      {ingredient.description}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF7F2',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  backButton: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#DE576F',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  productSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DE576F',
    marginTop: 30,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#DE576F',
  },
  productBrand: {
    fontSize: 16,
    color: '#DE576F',
    marginBottom: 2,
  },
  productType: {
    fontSize: 16,
    color: '#DE576F',
  },
  ingredientSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#DE576F',
  },
  accordionWrapper: {
    marginBottom: 12,
    overflow: 'hidden',
  },
  accordionHeader: {
    padding: 14,
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#DE576F',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionHeaderClosed: {
    borderRadius: 10,
  },
  activeHeaderOpen: {
    backgroundColor: '#FFE6EB',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  accordionContent: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#DE576F',
  },
  accordionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DE576F',
  },
  accordionContentText: {
    color: '#DE576F',
  },
});

export default ProductInformation;
