import styled from '@emotion/styled';
import type { ThemeProduct } from '../api/themes';

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
  padding: 18px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.08);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 12px;
  object-fit: cover;
  background: #eee;
  margin-bottom: 14px;
`;

const BrandName = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

const ProductName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
`;

const SellingPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #222;
`;

const BasicPrice = styled.div`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const DiscountRate = styled.div`
  font-size: 0.9rem;
  color: #e74c3c;
  font-weight: 600;
`;

interface ThemeProductCardProps {
  product: ThemeProduct;
  onClick?: (productId: number) => void;
}

const ThemeProductCard = ({ product, onClick }: ThemeProductCardProps) => {
  const handleClick = () => {
    onClick?.(product.id);
  };

  const hasDiscount = product.price.discountRate > 0;

  return (
    <Card onClick={handleClick}>
      <ProductImage src={product.imageURL} alt={product.name} />
      <BrandName>{product.brandInfo.name}</BrandName>
      <ProductName>{product.name}</ProductName>
      <PriceSection>
        <SellingPrice>
          {product.price.sellingPrice.toLocaleString()}원
        </SellingPrice>
        {hasDiscount && (
          <>
            <BasicPrice>
              {product.price.basicPrice.toLocaleString()}원
            </BasicPrice>
            <DiscountRate>
              {product.price.discountRate}%
            </DiscountRate>
          </>
        )}
      </PriceSection>
    </Card>
  );
};

export default ThemeProductCard; 