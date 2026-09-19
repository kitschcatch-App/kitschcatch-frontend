/**
 * 테스트: 닉네임 스텝 테스트 (NicknameStep.test)
 * 역할: 닉네임 중복 확인 API 연동에 따른 결과 표시와 검증 상태 변경을 검증합니다.
 */
import React, { useState } from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Text, TextInput, TouchableOpacity } from 'react-native';
import NicknameStep from '../screens/auth/signup-steps/NicknameStep';
import { userAPI } from '../api/apiClient';

jest.mock('../api/apiClient', () => ({
  userAPI: {
    checkNicknameAvailability: jest.fn(),
  },
}));

// 실제 SignUpScreen과 동일하게 value/verified 상태를 부모가 들고 있는 구조를 재현
const Harness = ({ onVerifiedChange }: { onVerifiedChange: (v: boolean) => void }) => {
  const [value, setValue] = useState('키치캐처');
  return <NicknameStep value={value} onChange={setValue} onVerifiedChange={onVerifiedChange} />;
};

const renderHarness = async (onVerifiedChange = jest.fn()) => {
  let root!: ReactTestRenderer.ReactTestRenderer;
  await act(async () => {
    root = ReactTestRenderer.create(<Harness onVerifiedChange={onVerifiedChange} />);
  });
  return root;
};

const pressCheckButton = async (root: ReactTestRenderer.ReactTestRenderer) => {
  await act(async () => {
    root.root.findByType(TouchableOpacity).props.onPress();
  });
};

describe('NicknameStep', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('중복 확인 성공 시 사용 가능 메시지를 보여주고 검증 상태를 true로 알린다', async () => {
    (userAPI.checkNicknameAvailability as jest.Mock).mockResolvedValue({
      data: { success: true, data: { nickname: '키치캐처' }, error: null },
    });
    const onVerifiedChange = jest.fn();

    const root = await renderHarness(onVerifiedChange);
    await pressCheckButton(root);

    expect(userAPI.checkNicknameAvailability).toHaveBeenCalledWith('키치캐처');
    expect(onVerifiedChange).toHaveBeenLastCalledWith(true);
    expect(root.root.findAllByType(Text).some(node => node.props.children === '사용 가능한 닉네임이에요')).toBe(true);
  });

  it('409 응답이면 중복 메시지를 보여주고 검증 상태를 false로 알린다', async () => {
    (userAPI.checkNicknameAvailability as jest.Mock).mockRejectedValue({ response: { status: 409 } });
    const onVerifiedChange = jest.fn();

    const root = await renderHarness(onVerifiedChange);
    await pressCheckButton(root);

    expect(onVerifiedChange).toHaveBeenLastCalledWith(false);
    expect(root.root.findAllByType(Text).some(node => node.props.children === '이미 사용 중인 닉네임이에요')).toBe(true);
  });

  it('중복 확인 후 닉네임을 수정하면 검증 상태를 다시 false로 알린다', async () => {
    (userAPI.checkNicknameAvailability as jest.Mock).mockResolvedValue({
      data: { success: true, data: { nickname: '키치캐처' }, error: null },
    });
    const onVerifiedChange = jest.fn();

    const root = await renderHarness(onVerifiedChange);
    await pressCheckButton(root);
    expect(onVerifiedChange).toHaveBeenLastCalledWith(true);

    await act(async () => {
      root.root.findByType(TextInput).props.onChangeText('다른닉네임');
    });

    expect(onVerifiedChange).toHaveBeenLastCalledWith(false);
  });
});
