/**
 * 화면: 백엔드 API 연동 테스트 화면 (ApiTestScreen)
 * 역할: 앱에 연결된 모든 백엔드 API 엔드포인트를 하나의 화면에서 테스트합니다.
 *
 * Mock 모드: 상단 토글로 가상 응답 데이터 사용 (백엔드 미연결 시)
 * Real 모드: 실제 서버(10.0.2.2:8080)로 요청
 *
 * 포함 API:
 *  - Auth:    Nonce 발급
 *  - Product: 목록 조회, 상세 조회, 등록, 수정, Presigned URL 발급
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { secureStorage } from '../utils/secureStorage';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { authAPI, productAPI } from '../api/apiClient';
import {
  mockDelay,
  MOCK_NONCE,
  MOCK_POST_LIST,
  getMockPostDetail,
  MOCK_PRESIGNED_URLS,
  MOCK_CREATE_POST,
  getMockUpdatePost,
} from '../api/mockData';
import { colors } from '../styles/colors';
import { typography } from '../styles/typography';

type Props = NativeStackScreenProps<RootStackParamList, 'ApiTest'>;

const BASE_URL = 'https://dev-kitschcatch.p-e.kr/api';

// ─── 테스트 결과 타입 ──────────────────────────────────────────────────────────
type TestStatus = 'idle' | 'loading' | 'success' | 'error';

interface TestResult {
  status: TestStatus;
  statusCode?: number;
  data?: any;
  errorMessage?: string;
  duration?: number;
  isMock?: boolean;
}

// ─── 하위 컴포넌트: 섹션 헤더 ─────────────────────────────────────────────────
const SectionHeader = ({ title, color = colors.main02 }: { title: string; color?: string }) => (
  <View style={[styles.sectionHeader, { borderLeftColor: color }]}>
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

// ─── 하위 컴포넌트: 상태 뱃지 ────────────────────────────────────────────────
const StatusBadge = ({ result }: { result: TestResult }) => {
  if (result.status === 'idle') return null;
  if (result.status === 'loading') return <ActivityIndicator size="small" color={colors.main02} />;

  const isSuccess = result.status === 'success';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      {result.isMock && (
        <View style={styles.mockBadge}>
          <Text style={styles.mockBadgeText}>MOCK</Text>
        </View>
      )}
      <View style={[styles.badge, isSuccess ? styles.badgeSuccess : styles.badgeError]}>
        <Text style={styles.badgeText}>
          {isSuccess ? '✅' : '❌'} {result.statusCode ?? (isSuccess ? '2xx' : 'ERR')}
          {result.duration !== undefined ? `  ${result.duration}ms` : ''}
        </Text>
      </View>
    </View>
  );
};

// ─── 하위 컴포넌트: 응답 JSON 뷰어 ───────────────────────────────────────────
const ResponseViewer = ({
  result,
  visible,
  onToggle,
}: {
  result: TestResult;
  visible: boolean;
  onToggle: () => void;
}) => {
  if (result.status === 'idle' || result.status === 'loading') return null;

  const content =
    result.status === 'error'
      ? result.errorMessage ?? '알 수 없는 오류'
      : JSON.stringify(result.data, null, 2);

  return (
    <View>
      <TouchableOpacity style={styles.toggleBtn} onPress={onToggle}>
        <Text style={styles.toggleBtnText}>{visible ? '▲ 응답 닫기' : '▼ 응답 보기'}</Text>
      </TouchableOpacity>
      {visible && (
        <ScrollView
          horizontal
          style={[styles.responseBox, result.status === 'error' && styles.responseBoxError]}
          showsHorizontalScrollIndicator
        >
          <Text
            style={[styles.responseText, result.status === 'error' && styles.responseTextError]}
          >
            {content}
          </Text>
        </ScrollView>
      )}
    </View>
  );
};

// ─── 하위 컴포넌트: 개별 API 테스트 카드 ──────────────────────────────────────
interface TestCardProps {
  title: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  endpoint: string;
  description?: string;
  requiresAuth?: boolean;
  onRun: () => Promise<void>;
  result: TestResult;
}

const TestCard = ({
  title,
  method,
  endpoint,
  description,
  requiresAuth,
  onRun,
  result,
}: TestCardProps) => {
  const [showResponse, setShowResponse] = useState(false);

  const methodColors: Record<string, string> = {
    GET: '#2196F3',
    POST: '#4CAF50',
    PATCH: '#FF9800',
    DELETE: '#F44336',
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.methodBadge, { backgroundColor: methodColors[method] + '22' }]}>
          <Text style={[styles.methodText, { color: methodColors[method] }]}>{method}</Text>
        </View>
        <Text style={styles.endpointText} numberOfLines={1}>
          {endpoint}
        </Text>
        {requiresAuth && <Text style={styles.authTag}>🔒</Text>}
        <StatusBadge result={result} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      {description && <Text style={styles.cardDescription}>{description}</Text>}

      <TouchableOpacity
        style={[styles.runButton, result.status === 'loading' && styles.runButtonDisabled]}
        onPress={onRun}
        disabled={result.status === 'loading'}
      >
        {result.status === 'loading' ? (
          <ActivityIndicator size="small" color={colors.black} />
        ) : (
          <Text style={styles.runButtonText}>테스트 실행</Text>
        )}
      </TouchableOpacity>

      <ResponseViewer
        result={result}
        visible={showResponse}
        onToggle={() => setShowResponse((v) => !v)}
      />
    </View>
  );
};

// ─── 메인 화면 컴포넌트 ──────────────────────────────────────────────────────
const ApiTestScreen = ({ navigation }: Props) => {
  const [isMockMode, setIsMockMode] = useState(true); // 기본값: Mock 모드 ON
  const [tokenStatus, setTokenStatus] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    userId: string | null;
  } | null>(null);
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [productIdInput, setProductIdInput] = useState('1');

  const setResult = useCallback((key: string, result: TestResult) => {
    setResults((prev) => ({ ...prev, [key]: result }));
  }, []);

  const getResult = (key: string): TestResult => results[key] ?? { status: 'idle' };

  // ─── 실제 API 실행 래퍼 ──────────────────────────────────────────────────
  const runRealTest = async (key: string, fn: () => Promise<any>) => {
    setResult(key, { status: 'loading' });
    const start = Date.now();
    try {
      const response = await fn();
      setResult(key, {
        status: 'success',
        statusCode: response.status,
        data: response.data,
        duration: Date.now() - start,
        isMock: false,
      });
    } catch (error: any) {
      setResult(key, {
        status: 'error',
        statusCode: error.response?.status,
        duration: Date.now() - start,
        isMock: false,
        errorMessage: error.response?.data
          ? JSON.stringify(error.response.data, null, 2)
          : error.message ?? '알 수 없는 오류',
      });
    }
  };

  // ─── Mock API 실행 래퍼 ───────────────────────────────────────────────────
  const runMockTest = async (key: string, mockFn: () => { status: number; data: any }) => {
    setResult(key, { status: 'loading' });
    const start = Date.now();
    await mockDelay(400 + Math.random() * 300); // 400~700ms 랜덤 지연
    const mock = mockFn();
    setResult(key, {
      status: 'success',
      statusCode: mock.status,
      data: mock.data,
      duration: Date.now() - start,
      isMock: true,
    });
  };

  // ─── 토큰 확인 / 삭제 ─────────────────────────────────────────────────────
  const handleCheckTokens = async () => {
    const [accessToken, refreshToken, userId] = await Promise.all([
      secureStorage.getItem('accessToken'),
      secureStorage.getItem('refreshToken'),
      secureStorage.getItem('userId'),
    ]);
    setTokenStatus({ accessToken, refreshToken, userId });
  };

  const handleClearTokens = async () => {
    await Promise.all([
      secureStorage.removeItem('accessToken'),
      secureStorage.removeItem('refreshToken'),
      secureStorage.removeItem('userId'),
    ]);
    setTokenStatus({ accessToken: null, refreshToken: null, userId: null });
  };

  // ─── 테스트 함수 정의 ────────────────────────────────────────────────────
  // Ping: 인터셉터 없는 raw axios 사용 → 401이 와도 refresh 시도 없음
  const testPing = () =>
    isMockMode
      ? runMockTest('ping', () => MOCK_POST_LIST)
      : runRealTest('ping', () =>
          axios.get(`${BASE_URL}/posts`, {
            params: { page: 0, size: 1 },
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' },
          }),
        );

  const testGetNonce = () =>
    isMockMode
      ? runMockTest('getNonce', () => MOCK_NONCE)
      : runRealTest('getNonce', () => authAPI.getNonce());

  const testGetPostList = () =>
    isMockMode
      ? runMockTest('getPostList', () => MOCK_POST_LIST)
      : runRealTest('getPostList', () =>
          productAPI.getPostList({ params: { page: 0, size: 5 } }),
        );

  const testGetPostDetail = () =>
    isMockMode
      ? runMockTest('getPostDetail', () => getMockPostDetail(productIdInput))
      : runRealTest('getPostDetail', () => productAPI.getPostDetail(productIdInput));

  const testGetPresignedUrls = () =>
    isMockMode
      ? runMockTest('getPresignedUrls', () => MOCK_PRESIGNED_URLS)
      : runRealTest('getPresignedUrls', () =>
          productAPI.getPresignedUrls([
            { originalFileName: 'test_image.jpg', contentType: 'image/jpeg' },
          ]),
        );

  const testCreatePost = () =>
    isMockMode
      ? runMockTest('createPost', () => MOCK_CREATE_POST)
      : runRealTest('createPost', () =>
          productAPI.createPost({
            title: '[테스트] API 테스트 상품',
            description: '이것은 ApiTestScreen에서 생성된 테스트 상품입니다.',
            price: 1000,
            productCategory: '기타',
            productCondition: 'NEW',
            imageKeys: [],
          }),
        );

  const testUpdatePost = () =>
    isMockMode
      ? runMockTest('updatePost', () => getMockUpdatePost(productIdInput))
      : runRealTest('updatePost', () =>
          productAPI.updatePost(productIdInput, { productStatus: 'ON_SALE' }),
        );

  // ─── 렌더링 ───────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>← 뒤로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>API 연동 테스트</Text>
          <Text style={styles.headerSubtitle}>BASE: {BASE_URL}</Text>
        </View>

        {/* ── Mock 모드 토글 ────────────────────────────────────────────── */}
        <View style={[styles.mockToggleCard, isMockMode && styles.mockToggleCardActive]}>
          <View style={styles.mockToggleLeft}>
            <Text style={styles.mockToggleTitle}>
              {isMockMode ? '🧪 Mock 모드' : '🔌 Real 모드'}
            </Text>
            <Text style={styles.mockToggleDesc}>
              {isMockMode
                ? '가상 데이터로 응답합니다. 서버 연결 불필요.'
                : '실제 서버(10.0.2.2:8080)로 요청합니다.'}
            </Text>
          </View>
          <Switch
            value={isMockMode}
            onValueChange={(v) => {
              setIsMockMode(v);
              setResults({});
            }}
            trackColor={{ false: colors.gray04, true: colors.sub01 }}
            thumbColor={isMockMode ? colors.main02 : colors.gray05}
          />
        </View>

        {/* ── 섹션 0: 서버 연결 확인 ────────────────────────────────────── */}
        <SectionHeader title="🌐 서버 연결 확인" color={colors.sub01} />
        <TestCard
          title="서버 Ping 테스트"
          method="GET"
          endpoint="/posts?page=0&size=1"
          description={
            isMockMode
              ? 'Mock: 가상 데이터를 즉시 반환합니다.'
              : 'Raw axios로 서버 응답 여부를 확인합니다. (인터셉터 없음)'
          }
          onRun={testPing}
          result={getResult('ping')}
        />

        {/* ── 섹션 1: 토큰 확인 ─────────────────────────────────────────── */}
        <SectionHeader title="🔑 저장된 토큰 확인" color="#9C27B0" />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AsyncStorage 토큰 조회</Text>
          <Text style={styles.cardDescription}>
            로그인 후 기기에 저장된 accessToken / refreshToken / userId를 확인합니다.
          </Text>
          <View style={styles.rowButtons}>
            <TouchableOpacity
              style={[styles.runButton, { flex: 1, marginRight: 8 }]}
              onPress={handleCheckTokens}
            >
              <Text style={styles.runButtonText}>토큰 확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.runButton, { flex: 1, backgroundColor: colors.gray02 }]}
              onPress={handleClearTokens}
            >
              <Text style={[styles.runButtonText, { color: colors.red }]}>토큰 삭제</Text>
            </TouchableOpacity>
          </View>
          {tokenStatus !== null && (
            <View style={styles.tokenBox}>
              <TokenRow label="accessToken" value={tokenStatus.accessToken} />
              <TokenRow label="refreshToken" value={tokenStatus.refreshToken} />
              <TokenRow label="userId" value={tokenStatus.userId} />
            </View>
          )}
        </View>

        {/* ── 섹션 2: Auth API ──────────────────────────────────────────── */}
        <SectionHeader title="🔐 Auth API" color="#FF5722" />
        <TestCard
          title="Nonce 발급"
          method="POST"
          endpoint="/auth/kakao/nonce"
          description="카카오 OIDC 로그인에 사용할 1회용 Nonce를 서버에서 발급합니다."
          onRun={testGetNonce}
          result={getResult('getNonce')}
        />

        {/* ── 섹션 3: Product API ───────────────────────────────────────── */}
        <SectionHeader title="📦 Product API" color={colors.main02} />

        <TestCard
          title="상품 목록 조회"
          method="GET"
          endpoint="/posts?page=0&size=5"
          description="등록된 상품 5개를 가져옵니다."
          onRun={testGetPostList}
          result={getResult('getPostList')}
        />

        {/* 상품 상세 (ID 입력) */}
        <IDInputCard
          title="상품 상세 조회"
          method="GET"
          endpoint="/posts/{id}"
          description="입력한 ID의 상품 상세 정보를 가져옵니다."
          productIdInput={productIdInput}
          setProductIdInput={setProductIdInput}
          onRun={testGetPostDetail}
          result={getResult('getPostDetail')}
        />

        <TestCard
          title="S3 Presigned URL 발급"
          method="POST"
          endpoint="/posts/images/presigned-urls"
          description="test_image.jpg 1장 업로드 URL을 발급합니다."
          requiresAuth
          onRun={testGetPresignedUrls}
          result={getResult('getPresignedUrls')}
        />

        <TestCard
          title="상품 등록 (더미 데이터)"
          method="POST"
          endpoint="/posts"
          description='"[테스트] API 테스트 상품" / 1,000원 / 기타 / 이미지 없이 등록합니다.'
          requiresAuth
          onRun={testCreatePost}
          result={getResult('createPost')}
        />

        {/* 상품 수정 (ID 입력) */}
        <IDInputCard
          title="상품 상태 수정"
          method="PATCH"
          endpoint="/posts/{id}"
          description="입력한 ID 상품의 상태를 ON_SALE로 수정합니다. (본인 게시글 필요)"
          requiresAuth
          productIdInput={productIdInput}
          setProductIdInput={setProductIdInput}
          onRun={testUpdatePost}
          result={getResult('updatePost')}
        />

        {/* ── 전체 초기화 ────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.clearButton} onPress={() => setResults({})}>
          <Text style={styles.clearButtonText}>🗑 전체 결과 초기화</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── ID 입력 + 실행 카드 (상세 조회 / 수정 공용) ─────────────────────────────
interface IDInputCardProps {
  title: string;
  method: 'GET' | 'PATCH';
  endpoint: string;
  description?: string;
  requiresAuth?: boolean;
  productIdInput: string;
  setProductIdInput: (v: string) => void;
  onRun: () => Promise<void>;
  result: TestResult;
}

const IDInputCard = ({
  title,
  method,
  endpoint,
  description,
  requiresAuth,
  productIdInput,
  setProductIdInput,
  onRun,
  result,
}: IDInputCardProps) => {
  const [showResponse, setShowResponse] = useState(false);
  const methodColor = method === 'GET' ? '#2196F3' : '#FF9800';

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.methodBadge, { backgroundColor: methodColor + '22' }]}>
          <Text style={[styles.methodText, { color: methodColor }]}>{method}</Text>
        </View>
        <Text style={styles.endpointText} numberOfLines={1}>
          {endpoint}
        </Text>
        {requiresAuth && <Text style={styles.authTag}>🔒</Text>}
        <StatusBadge result={result} />
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      {description && <Text style={styles.cardDescription}>{description}</Text>}

      <View style={styles.inputRow}>
        <Text style={styles.inputLabel}>상품 ID</Text>
        <TextInput
          style={styles.textInput}
          value={productIdInput}
          onChangeText={setProductIdInput}
          keyboardType="number-pad"
          placeholder="1"
          placeholderTextColor={colors.gray05}
        />
      </View>

      <TouchableOpacity
        style={[styles.runButton, result.status === 'loading' && styles.runButtonDisabled]}
        onPress={onRun}
        disabled={result.status === 'loading'}
      >
        {result.status === 'loading' ? (
          <ActivityIndicator size="small" color={colors.black} />
        ) : (
          <Text style={styles.runButtonText}>테스트 실행</Text>
        )}
      </TouchableOpacity>

      <ResponseViewer
        result={result}
        visible={showResponse}
        onToggle={() => setShowResponse((v) => !v)}
      />
    </View>
  );
};

// ─── 토큰 행 ─────────────────────────────────────────────────────────────────
const TokenRow = ({ label, value }: { label: string; value: string | null }) => (
  <View style={styles.tokenRow}>
    <Text style={styles.tokenLabel}>{label}</Text>
    {value ? (
      <Text style={styles.tokenValue} numberOfLines={1} ellipsizeMode="middle">
        {value}
      </Text>
    ) : (
      <Text style={styles.tokenEmpty}>없음</Text>
    )}
  </View>
);

// ─── 스타일 ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.white },
  scroll: { padding: 16 },

  header: { marginBottom: 20 },
  backBtn: { marginBottom: 8 },
  backBtnText: { fontSize: 14, fontFamily: typography.M, color: colors.main02 },
  headerTitle: { fontSize: 22, fontFamily: typography.B, color: colors.black, marginBottom: 4 },
  headerSubtitle: { fontSize: 12, fontFamily: typography.R, color: colors.gray01 },

  // Mock 토글 카드
  mockToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray03,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.gray04,
    marginBottom: 4,
  },
  mockToggleCardActive: {
    borderColor: colors.sub01,
    backgroundColor: '#E8FBF7',
  },
  mockToggleLeft: { flex: 1 },
  mockToggleTitle: { fontSize: 15, fontFamily: typography.SB, color: colors.black, marginBottom: 2 },
  mockToggleDesc: { fontSize: 12, fontFamily: typography.R, color: colors.gray01 },

  sectionHeader: {
    borderLeftWidth: 4,
    paddingLeft: 10,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 15, fontFamily: typography.SB, color: colors.black },

  card: {
    backgroundColor: colors.gray03,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.gray02,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardTitle: { fontSize: 15, fontFamily: typography.SB, color: colors.black, marginBottom: 4 },
  cardDescription: {
    fontSize: 12,
    fontFamily: typography.R,
    color: colors.gray01,
    marginBottom: 12,
    lineHeight: 18,
  },
  authTag: { fontSize: 12 },

  methodBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  methodText: { fontSize: 11, fontFamily: typography.B },
  endpointText: { flex: 1, fontSize: 12, fontFamily: typography.M, color: colors.black },

  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeSuccess: { backgroundColor: '#E8F5E9' },
  badgeError: { backgroundColor: '#FFEBEE' },
  badgeText: { fontSize: 11, fontFamily: typography.SB },

  mockBadge: {
    backgroundColor: colors.sub01 + '33',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mockBadgeText: { fontSize: 9, fontFamily: typography.B, color: colors.sub02 },

  runButton: {
    backgroundColor: colors.main01,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  runButtonDisabled: { opacity: 0.5 },
  runButtonText: { fontSize: 14, fontFamily: typography.SB, color: colors.black },

  toggleBtn: { marginTop: 10, alignSelf: 'flex-start' },
  toggleBtnText: { fontSize: 12, fontFamily: typography.M, color: colors.main02 },
  responseBox: {
    marginTop: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    maxHeight: 200,
  },
  responseBoxError: { backgroundColor: '#2C1010' },
  responseText: { fontSize: 11, fontFamily: 'monospace', color: '#D4D4D4', lineHeight: 18 },
  responseTextError: { color: '#FF8A80' },

  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  inputLabel: { fontSize: 13, fontFamily: typography.M, color: colors.black, width: 56 },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray04,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: typography.R,
    color: colors.black,
    backgroundColor: colors.white,
  },

  tokenBox: {
    marginTop: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray04,
    gap: 8,
  },
  tokenRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tokenLabel: { fontSize: 12, fontFamily: typography.SB, color: colors.black, width: 100 },
  tokenValue: { flex: 1, fontSize: 11, fontFamily: 'monospace', color: colors.main02 },
  tokenEmpty: { fontSize: 12, fontFamily: typography.R, color: colors.red },

  rowButtons: { flexDirection: 'row', marginTop: 4 },

  clearButton: {
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.gray04,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  clearButtonText: { fontSize: 14, fontFamily: typography.M, color: colors.gray01 },
});

export default ApiTestScreen;
