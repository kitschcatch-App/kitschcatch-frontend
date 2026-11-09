/**
 * 컴포넌트: 우편번호 검색 모달 (PostcodeModal)
 * 역할: 카카오(다음) 우편번호 서비스를 WebView로 띄워 주소를 검색·선택하게 합니다. (API 키 불필요)
 */
import React from 'react';
import { Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (result: { zonecode: string; address: string }) => void;
}

const HTML = `<!doctype html><html><head>
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>html,body,#c{margin:0;height:100%}</style></head><body><div id="c"></div>
<script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<script>
new daum.Postcode({
  oncomplete: function (d) {
    window.ReactNativeWebView.postMessage(JSON.stringify({ zonecode: d.zonecode, address: d.address }));
  },
  width: '100%', height: '100%'
}).embed(document.getElementById('c'));
</script></body></html>`;

const PostcodeModal = ({ visible, onClose, onSelect }: Props) => (
  <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
    <SafeAreaView style={styles.flex}>
      <TouchableOpacity style={styles.close} onPress={onClose}>
        <Text style={styles.closeText}>닫기</Text>
      </TouchableOpacity>
      <WebView
        source={{ html: HTML, baseUrl: 'https://postcode.local' }}
        onMessage={e => onSelect(JSON.parse(e.nativeEvent.data))}
      />
    </SafeAreaView>
  </Modal>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  close: { alignSelf: 'flex-end', padding: 16 },
  closeText: { fontSize: 16 },
});

export default PostcodeModal;
