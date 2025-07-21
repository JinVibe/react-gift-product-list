import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Layout } from "@/Components/layout/Layout";
import styled from "@emotion/styled";
import { cardTemplates } from "@/Components/cardTemplates";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useProductSummary } from "@/hooks/useProductSummary";
import { useOrder } from "@/hooks/useOrder";
import { getUserInfo } from "@/utils/storage";

// ===== 타입 정의 및 Zod 스키마 =====
const receiverSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  phone: z.string().regex(/^010[0-9]{8}$/, '01012345678 형식으로 입력하세요.'),
  quantity: z.coerce.number().min(1, '최소 1개 이상'),
});

const receiversSchema = z.array(receiverSchema)
  .min(1, '최소 1명 이상')
  .max(10, '최대 10명까지')
  .refine(arr => new Set(arr.map(r => r.phone)).size === arr.length, {
    message: '전화번호가 중복되었습니다.',
    path: ['phoneDup'],
  });

const orderSchema = z.object({
  selectedCardId: z.number(),
  message: z.string().min(1, '메시지를 입력하세요.'),
  sender: z.string().min(1, '보내는 사람 이름을 입력하세요.'),
  receivers: receiversSchema
});

type OrderFormValues = z.infer<typeof orderSchema>;

// ===== 카드 미리보기 관련 스타일 =====
const PreviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
`;

const PreviewImage = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
  margin-bottom: 16px;
`;

const MessageInput = styled.textarea`
  width: 100%;
  max-width: 320px;
  min-height: 60px;
  font-size: 1.1rem;
  padding: 12px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  resize: none;
  box-sizing: border-box;
  margin-bottom: 8px;
  background: #fafafa;
`;

// ===== 카드 선택 관련 스타일 =====
const CardList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  margin: 0 0 24px 0;
  overflow-x: auto;
  padding: 8px 0 8px 0;
  scrollbar-width: thin;
  &::-webkit-scrollbar {
    height: 6px;
    background: #f0f0f0;
  }
  &::-webkit-scrollbar-thumb {
    background: #e0e0e0;
    border-radius: 4px;
  }
`;

const CardItem = styled.div<{ selected: boolean }>`
  flex: 0 0 auto;
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid ${({ selected }) => selected ? '#f7e244' : 'transparent'};
  background: ${({ selected }) => selected ? '#fffbe6' : 'transparent'};
  box-shadow: ${({ selected }) => selected ? '0 2px 8px #ffe14a' : 'none'};
  transition: border 0.2s, background 0.2s, box-shadow 0.2s;
`;

const Thumb = styled.img<{ selected: boolean }>`
  width: 64px;
  height: 64px;
  border-radius: 10px;
  object-fit: cover;
  margin-bottom: 4px;
  border: 2px solid ${({ selected }) => selected ? '#f7e244' : '#eee'};
  box-shadow: ${({ selected }) => selected ? '0 2px 8px #ffe14a' : 'none'};
  transition: border 0.2s, box-shadow 0.2s;
`;

// ===== 주문 버튼 스타일 =====
const OrderButton = styled.button`
  width: 100%;
  background: #f7e244;
  color: #222;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  padding: 18px 0;
  margin-top: 12px;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
  &:hover:enabled {
    background: #ffe14a;
  }
  &:disabled {
    background: #f0f0f0;
    color: #b0b3ba;
    cursor: not-allowed;
  }
`;

// ===== 보내는 사람 섹션 스타일 =====
const SenderSection = styled.section`
  background: #fafbfc;
  border-radius: 12px;
  padding: 24px 16px 16px 16px;
  margin-bottom: 24px;
`;

const SenderTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const SenderInput = styled.input`
  width: 100%;
  font-size: 1.1rem;
  padding: 16px 18px;
  border: 1.5px solid #d6dbe1;
  border-radius: 16px;
  outline: none;
  margin-bottom: 8px;
  background: #fff;
  &::placeholder {
    color: #b0b3ba;
  }
`;

const SenderGuide = styled.div`
  font-size: 0.95rem;
  color: #b0b3ba;
  margin-left: 2px;
`;

// ===== 받는 사람 섹션 스타일 =====
const ReceiverSection = styled.section`
  background: #fafbfc;
  border-radius: 12px;
  padding: 24px 16px 16px 16px;
  margin-bottom: 24px;
`;

const ReceiverTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ReceiverRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const ReceiverLabel = styled.label`
  width: 80px;
  font-size: 1rem;
  font-weight: 500;
  color: #222;
`;

const ReceiverInput = styled.input`
  flex: 1;
  font-size: 1.1rem;
  padding: 14px 16px;
  border: 1.5px solid #d6dbe1;
  border-radius: 12px;
  outline: none;
  background: #fff;
  &::placeholder {
    color: #b0b3ba;
  }
`;

// ===== 상품 정보 섹션 스타일 =====
const ProductSection = styled.section`
  background: #fafbfc;
  border-radius: 12px;
  padding: 24px 16px 16px 16px;
  margin-bottom: 24px;
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ProductBox = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid #e0e0e0;
  border-radius: 18px;
  padding: 18px 20px;
  gap: 18px;
`;

const ProductImg = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 10px;
  object-fit: cover;
  background: #f0f0f0;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ProductName = styled.div`
  font-size: 1.08rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 2px;
`;

// ===== 레이아웃 관련 스타일 =====
const ContentWrapper = styled.div`
  padding-bottom: 100px; // 푸터 높이만큼 여백
`;

const FixedFooter = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  max-width: 720px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.04);
  padding: 0 16px 24px 16px;
  z-index: 100;
  @media (min-width: 720px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

// ===== 에러 메시지 스타일 =====
const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 1rem;
  margin: 4px 0 8px 4px;
`;

// ===== 커스텀 모달 스타일 =====
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 16px;
  max-width: 480px;
  width: 95vw;
  padding: 32px 24px 24px 24px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 18px;
`;

const ModalButton = styled.button`
  background: #f7e244;
  color: #222;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ffe14a;
  }
`;

const Order = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const productId = id ? parseInt(id) : 0;
  
  // Custom Hooks 사용
  const { product, loading: productLoading, error: productError } = useProductSummary(productId);
  const { order, isLoading: orderLoading } = useOrder();
  
  // userInfo에서 name 가져오기
  const userInfo = getUserInfo();
  const senderName = userInfo?.name || "";
  
  const selectedCardDefault = cardTemplates[0];

  // react-hook-form 세팅 (메인 폼, Zod resolver 적용)
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      selectedCardId: selectedCardDefault?.id ?? 0,
      message: selectedCardDefault?.defaultTextMessage ?? "",
      sender: senderName, // userInfo의 name을 defaultValue로 설정 (없으면 빈 문자열)
      receivers: []
    }
  });

  // 모달 상태
  const [receiverModalOpen, setReceiverModalOpen] = useState(false);

  // 모달용 react-hook-form 세팅 (받는 사람 입력/수정)
  const {
    control: modalControl,
    register: modalRegister,
    handleSubmit: modalHandleSubmit,
    reset: modalReset
  } = useForm<{ receivers: OrderFormValues["receivers"] }>({
    resolver: zodResolver(z.object({ receivers: receiversSchema })),
    defaultValues: { receivers: [] }
  });
  const { fields: modalFields, append: modalAppend, remove: modalRemove } = useFieldArray({
    control: modalControl,
    name: "receivers"
  });

  // 모달 열기: 기존 데이터 복사
  const openReceiverModal = () => {
    modalReset({ receivers: watch("receivers") });
    setReceiverModalOpen(true);
  };
  // 모달 완료: 메인 폼에 반영
  const handleReceiverModalComplete = modalHandleSubmit((data) => {
    if (data.receivers.length === 0) return; // 0명일 때 반영 X
    // 모든 정보가 정확히 입력되어야만 반영
    const valid = data.receivers.every(r => r.name && /^010[0-9]{8}$/.test(r.phone) && r.quantity >= 1);
    if (!valid) return;
    setValue("receivers", data.receivers);
    setReceiverModalOpen(false);
  });

  // 카드 선택 핸들러
  const handleSelect = (cardId: number) => {
    setValue("selectedCardId", cardId);
    const card = cardTemplates.find(c => c.id === cardId);
    setValue("message", card?.defaultTextMessage ?? "");
  };

  // 주문 제출 핸들러
  const onSubmit = async (data: OrderFormValues) => {
    // 로그인 체크 - 주문 시에만 확인
    if (!userInfo?.authToken) {
      navigate('/login', { 
        state: { redirect: `/order/${productId}` }
      });
      return;
    }

    // 주문 데이터 준비
    const orderData = {
      productId: productId,
      senderName: data.sender,
      senderEmail: userInfo.email,
      receiverName: data.receivers[0]?.name || '',
      receiverEmail: '', // 받는 사람 이메일은 별도로 입력받지 않으므로 빈 문자열
      message: data.message,
    };

    const result = await order(orderData, userInfo.authToken);
    if (result) {
      // 주문 성공 시 처리 (예: 주문 완료 페이지로 이동)
      console.log('주문 성공:', result);
    }
  };

  // 제품 로딩 중이거나 에러인 경우 처리
  if (productLoading) {
    return <Layout><div>제품 정보를 불러오는 중...</div></Layout>;
  }

  if (productError || !product) {
    return <Layout><div>제품 정보를 불러올 수 없습니다.</div></Layout>;
  }

  // 선택된 카드
  const selectedCard = cardTemplates.find(card => card.id === watch("selectedCardId"));

  return (
    <Layout>
      <ContentWrapper>
        {/* ===== 카드 선택 섹션 ===== */}
        <h2>카드 템플릿 선택</h2>
        <CardList>
          {cardTemplates.map(card => (
            <CardItem
              key={card.id}
              selected={watch("selectedCardId") === card.id}
              onClick={() => handleSelect(card.id)}
            >
              <Thumb src={card.thumbUrl} alt={card.defaultTextMessage} selected={watch("selectedCardId") === card.id} />
            </CardItem>
          ))}
        </CardList>

        {/* ===== 카드 미리보기 섹션 ===== */}
        <PreviewWrapper>
          {selectedCard && (
            <>
              <PreviewImage src={selectedCard.imageUrl} alt={selectedCard.defaultTextMessage} />
              <MessageInput
                {...register("message", { required: "메시지를 입력하세요." })}
                placeholder="메시지를 입력하세요."
              />
              {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
            </>
          )}
        </PreviewWrapper>

        {/* ===== 보내는 사람 섹션 ===== */}
        <SenderSection>
          <SenderTitle>보내는 사람</SenderTitle>
          <SenderInput
            type="text"
            placeholder="이름을 입력하세요."
            defaultValue={senderName}
            {...register("sender", { required: "보내는 사람 이름을 입력하세요." })}
          />
          {errors.sender && <ErrorMessage>{errors.sender.message}</ErrorMessage>}
          <SenderGuide>* 실제 선물 발송 시 발신자이름으로 반영되는 정보입니다.</SenderGuide>
        </SenderSection>

        {/* ===== 받는 사람 섹션 (요약 테이블/리스트 + 추가/수정 버튼만) ===== */}
        <ReceiverSection>
          <ReceiverTitle>받는 사람</ReceiverTitle>
          {/* 받는 사람 요약 테이블 */}
          {watch("receivers").length === 0 ? (
            <div style={{
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b0b3ba',
              background: '#fff',
              borderRadius: 12,
              border: '1.5px solid #e0e0e0',
              marginBottom: 16
            }}>
              받는 사람이 없습니다.<br/>받는 사람을 추가해주세요.
            </div>
          ) : (
            <table style={{ width: '100%', background: '#fff', borderRadius: 12, borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr style={{ background: '#f5f6fa' }}>
                  <th style={{ padding: '10px 0', fontWeight: 700 }}>이름</th>
                  <th style={{ padding: '10px 0', fontWeight: 700 }}>전화번호</th>
                  <th style={{ padding: '10px 0', fontWeight: 700 }}>수량</th>
                </tr>
              </thead>
              <tbody>
                {watch("receivers").map((r, idx) => (
                  <tr key={idx} style={{ textAlign: 'center', borderTop: '1px solid #eee' }}>
                    <td style={{ padding: '8px 0' }}>{r.name}</td>
                    <td style={{ padding: '8px 0' }}>{r.phone}</td>
                    <td style={{ padding: '8px 0' }}>{r.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <OrderButton
            type="button"
            onClick={openReceiverModal}
            style={{ marginBottom: 0, background: '#f5f6fa', color: '#222', fontWeight: 500 }}
          >
            {watch("receivers").length === 0 ? '추가' : '수정'}
          </OrderButton>
        </ReceiverSection>

        {/* ===== 제품 정보 섹션 (주문 버튼 위) ===== */}
        <ProductSection>
          <ProductTitle>선택한 상품</ProductTitle>
          <ProductBox>
            <ProductImg src={product.imageURL} alt={product.name} />
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <div style={{ color: '#666', fontSize: '0.95rem' }}>
                {product.brandName}
              </div>
              <div style={{ fontWeight: 700, color: '#222', marginTop: 4 }}>
                {product.price?.toLocaleString()}원
              </div>
            </ProductInfo>
          </ProductBox>
        </ProductSection>
      </ContentWrapper>
      <FixedFooter>
        <form onSubmit={handleSubmit(onSubmit)}>
          <OrderButton type="submit" disabled={orderLoading}>
            {orderLoading ? "주문 처리 중..." : userInfo?.authToken ? "주문하기" : "로그인 후 주문하기"}
          </OrderButton>
        </form>
      </FixedFooter>
      {/* ===== 받는 사람 입력/수정 모달 ===== */}
      {receiverModalOpen && (
        <ModalOverlay onClick={() => setReceiverModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>받는 사람</ModalTitle>
            <div style={{ fontSize: '0.98rem', color: '#888', marginBottom: 12 }}>
              * 최대 10명까지 추가 할 수 있어요.<br/>
              * 받는 사람의 전화번호를 중복으로 입력할 수 없어요.
            </div>
            <ModalButton type="button" onClick={() => modalAppend({ name: '', phone: '', quantity: 1 })} disabled={modalFields.length >= 10} style={{ marginBottom: 16 }}>
              추가하기
            </ModalButton>
            {modalFields.length === 0 && (
              <div style={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b0b3ba', background: '#f8f8f8', borderRadius: 12, border: '1.5px solid #e0e0e0', marginBottom: 16 }}>
                받는 사람이 없습니다.<br/>받는 사람을 추가해주세요.
              </div>
            )}
            {modalFields.map((field, idx) => (
              <div key={field.id} style={{ marginBottom: 18, background: '#fafbfc', borderRadius: 12, padding: 16, position: 'relative' }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>받는 사람 {idx + 1} <span style={{ cursor: 'pointer', color: '#e74c3c', marginLeft: 8 }} onClick={() => modalRemove(idx)}>×</span></div>
                <ReceiverRow>
                  <ReceiverLabel>이름</ReceiverLabel>
                  <ReceiverInput
                    {...modalRegister(`receivers.${idx}.name`)}
                    placeholder="이름"
                  />
                </ReceiverRow>
                <ReceiverRow>
                  <ReceiverLabel>전화번호</ReceiverLabel>
                  <ReceiverInput
                    {...modalRegister(`receivers.${idx}.phone`)}
                    placeholder="01012345678"
                  />
                </ReceiverRow>
                <ReceiverRow>
                  <ReceiverLabel>수량</ReceiverLabel>
                  <ReceiverInput
                    type="number"
                    min={1}
                    {...modalRegister(`receivers.${idx}.quantity`)}
                  />
                </ReceiverRow>
              </div>
            ))}
            <ModalButton type="button" onClick={handleReceiverModalComplete}>
              완료
            </ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </Layout>
  );
};

export default Order; 