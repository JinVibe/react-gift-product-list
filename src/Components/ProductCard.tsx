import styled from '@emotion/styled';

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

const RankBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #e74c3c;
  color: #fff;
  font-weight: 700;
  font-size: 1.1rem;
  border-radius: 8px;
  padding: 2px 10px;
  z-index: 2;
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

// 범용 상품 타입 정의
export interface ProductData {
  id: number;
  name: string;
  imageURL: string;
  brandInfo?: {
    id?: number;
    name: string;
    imageURL?: string;
  };
  price?: {
    basicPrice?: number;
    sellingPrice: number;
    discountRate?: number;
  };
  rankingType?: string;
}

interface ProductCardProps {
  product: ProductData;
  onClick?: (productId: number) => void;
  showRankBadge?: boolean;
  rankNumber?: number;
}

const ProductCard = ({ 
  product, 
  onClick, 
  showRankBadge = false, 
  rankNumber 
}: ProductCardProps) => {
  const handleClick = () => {
    onClick?.(product.id);
  };

  const hasDiscount = product.price?.discountRate && product.price.discountRate > 0;
  const hasBasicPrice = product.price?.basicPrice && product.price.basicPrice > product.price.sellingPrice;

  return (
    <Card onClick={handleClick}>
      {showRankBadge && rankNumber && (
        <RankBadge>{rankNumber}</RankBadge>
      )}
      <ProductImage src={product.imageURL} alt={product.name} />
      {product.brandInfo?.name && (
        <BrandName>{product.brandInfo.name}</BrandName>
      )}
      <ProductName>{product.name}</ProductName>
      <PriceSection>
        <SellingPrice>
          {product.price?.sellingPrice 
            ? `${product.price.sellingPrice.toLocaleString()}원`
            : "가격 정보 없음"
          }
        </SellingPrice>
        {hasDiscount && hasBasicPrice && (
          <>
            <BasicPrice>
              {product.price?.basicPrice?.toLocaleString()}원
            </BasicPrice>
            <DiscountRate>
              {product.price?.discountRate}%
            </DiscountRate>
          </>
        )}
      </PriceSection>
    </Card>
  );
};

export default ProductCard;
