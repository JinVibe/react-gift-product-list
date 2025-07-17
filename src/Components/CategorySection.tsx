import styled from '@emotion/styled'

const SectionWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 32px 0 0 0;
`

const Title = styled.h2`
  ${({ theme }) => theme.typography.title1Bold};
  color: ${({ theme }) => theme.colors.gray.gray900};
  margin-bottom: 24px;
  letter-spacing: -1px;
`

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 32px 0;
  justify-items: center;
  align-items: center;
  width: 100%;
  @media (max-width: 600px) {
    gap: 20px 0;
  }
`

const CategorySection = () => {
  return (
    <SectionWrapper>
      {/* 기존 목데이터 렌더링 제거됨. 필요시 다른 카테고리 용도로 사용 가능 */}
    </SectionWrapper>
  )
}

export default CategorySection 