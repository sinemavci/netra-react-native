import 'react-native-get-random-values';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Animated,
} from 'react-native';
import {
  ConverterType,
  Duration,
  NetraClient,
  OfflinePolicyAction,
  RequestBody,
  RequestBodyPart,
  RequestOptions,
  SlowNetworkPolicyAction,
} from 'netra-react-native';
import { TextEncoder } from 'text-encoding';
import { encode } from 'base64-arraybuffer';
import { launchImageLibrary } from 'react-native-image-picker';

type RequestResult = {
  label: string;
  statusCode?: number | null;
  data?: string | null;
  error?: string | null;
};

const githubClient = new NetraClient({
  baseUrl: 'https://api.github.com',
  converterType: ConverterType.GSON,
});

const mainClient = new NetraClient({
  baseUrl: 'http://10.0.2.2:3001',
  converterType: ConverterType.MOSHI,
});

const jsonPlaceholderClient = new NetraClient({
  baseUrl: 'https://jsonplaceholder.typicode.com',
  converterType: ConverterType.KOTLINX,
});

class Repo {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export default function App() {
  const [lastResult, setLastResult] = useState<RequestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    message: string;
    color: string;
  } | null>(null);
  const snackbarAnim = useRef(new Animated.Value(0)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSnackbar = useCallback(
    (message: string, color: string = '#37474F') => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setSnackbar({ message, color });
      Animated.timing(snackbarAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();

      hideTimer.current = setTimeout(() => {
        Animated.timing(snackbarAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start(() => {
          setSnackbar(null);
        });
      }, 2000);
    },
    [snackbarAnim]
  );

  useEffect(() => {
    console.log('useeeffect triggered');
    mainClient
      .on('RequestExecuted', (result) => {
        showSnackbar(`⚡ Executing on ${result.request.url}`);
      })
      .then();

    githubClient
      .on('RequestExecuted', (result) => {
        showSnackbar(`⚡ Executing on ${result.request.url}`);
      })
      .then();

    jsonPlaceholderClient
      .on('RequestExecuted', (result) => {
        showSnackbar(`⚡ Executing on ${result.request.url}`);
      })
      .then();

    mainClient
      .on('RequestSuccess', ({ response, request }) => {
        showSnackbar(`✅ Success request: ${request.url}`);
        console.log(
          `Success response: ${request.url} --- ${JSON.stringify(response.data)}`
        );
      })
      .then();

    mainClient
      .on('RequestFailed', ({ response, request, exception }) => {
        showSnackbar(
          `❌ Failed request: ${request.url} due to code: ${exception ?? response?.statusCode?.toString() ?? 'unknown'}`
        );
        console.log(
          `Failed response: ${request.url}`,
          response?.data?.toString()
        );
      })
      .then();

    githubClient
      .on('RequestSuccess', ({ response, request }) => {
        showSnackbar(`✅ Success request: ${request.url}`);
        console.log(
          `Success response: ${request.url} --- ${JSON.stringify(response.data)}`
        );
      })
      .then();

    githubClient
      .on('RequestFailed', ({ response, request, exception }) => {
        showSnackbar(
          `❌ Failed request: ${request.url} due to code: ${exception ?? response?.statusCode?.toString() ?? 'unknown'}`
        );
        console.log(
          `failed response: ${request.url}`,
          response?.data?.toString()
        );
      })
      .then();

    jsonPlaceholderClient
      .on('RequestSuccess', ({ response, request }) => {
        showSnackbar(`✅ Success request: ${request.url}`);
        console.log(
          `Success response: ${request.url} --- ${JSON.stringify(response.data)}`
        );
      })
      .then();

    jsonPlaceholderClient
      .on('RequestFailed', ({ response, request, exception }) => {
        showSnackbar(
          `❌ Failed request: ${request.url} due to code: ${exception ?? response?.statusCode?.toString() ?? 'unknown'}`
        );
      })
      .then();
    mainClient
      .on('RequestQueued', ({ url, queueOrder, createdAt }) => {
        showSnackbar(
          `⚡ Request Queued:${url} queueOrder: ${queueOrder} createdAt: ${createdAt}`
        );
      })
      .then();

    githubClient
      .on('RequestQueued', ({ url, queueOrder, createdAt }) => {
        showSnackbar(
          `⚡ Request Queued:${url} queueOrder: ${queueOrder} createdAt: ${createdAt}`
        );
      })
      .then();

    jsonPlaceholderClient
      .on('RequestQueued', ({ url, queueOrder, createdAt }) => {
        showSnackbar(
          `⚡ Request Queued:${url} queueOrder: ${queueOrder} createdAt: ${createdAt}`
        );
      })
      .then();

    mainClient
      .on('QueuedRequestSuccess', ({ url, response }) => {
        showSnackbar(
          `⚡ Queued Request success:${url} response: ${JSON.stringify(response)}`
        );
      })
      .then();

    githubClient
      .on('QueuedRequestSuccess', ({ url, response }) => {
        showSnackbar(
          `⚡ Queued Request success:${url} response: ${JSON.stringify(response)}`
        );
      })
      .then();

    jsonPlaceholderClient
      .on('QueuedRequestSuccess', ({ url, response }) => {
        showSnackbar(
          `⚡ Queued Request success:${url} response: ${JSON.stringify(response)}`
        );
      })
      .then();

    // mainClient
    //   .on('CacheStored', ({ request, ageMs, sizeByte }) => {
    //     showSnackbar(
    //       `⚡ Cache Stored:${request.url} ageMs: ${ageMs} sizeByte: ${sizeByte}`
    //     );
    //   })
    //   .then();

    // githubClient
    //   .on('CacheStored', ({ request, ageMs, sizeByte }) => {
    //     showSnackbar(
    //       `⚡ Cache Stored:${request.url} ageMs: ${ageMs} sizeByte: ${sizeByte}`
    //     );
    //   })
    //   .then();

    // jsonPlaceholderClient
    //   .on('CacheStored', ({ request, ageMs, sizeByte }) => {
    //     showSnackbar(
    //       `⚡ Cache Stored:${request.url} ageMs: ${ageMs} sizeByte: ${sizeByte}`
    //     );
    //   })
    //   .then();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const runRequest = async (label: string, action: () => Promise<any>) => {
    setLoading(true);
    setLastResult(null);
    try {
      const response = await action();
      setLastResult({
        label,
        statusCode: response?.statusCode,
        data: JSON.stringify(response?.data),
      });
    } catch (e: any) {
      setLastResult({ label, error: e?.message ?? String(e) });
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    setLoading(true);
    setLastResult(null);
    try {
      const response = await githubClient.get<Repo[]>(
        new RequestOptions({
          url: '/users/octocat/repos',
          offlinePolicyAction: OfflinePolicyAction.queue(),
          cancelOnDispose: true,
          slowNetworkPolicyAction: SlowNetworkPolicyAction.timeout(
            Duration.seconds(5)
          ),
        })
      );
      setLastResult({
        label: 'GET /?status=200',
        statusCode: response?.statusCode,
        data: JSON.stringify(response?.data?.slice(0, 2)),
      });
    } catch (e: any) {
      setLastResult({
        label: 'GET /?status=200',
        error: e?.message ?? String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePost = () =>
    runRequest('POST /users', () =>
      jsonPlaceholderClient.post(
        new RequestOptions({
          url: '/users',
          body: RequestBody.createJson(
            JSON.stringify({ name: 'Sinem', job: 'developer' })
          ),
          offlinePolicyAction: OfflinePolicyAction.retry(
            3,
            Duration.seconds(4)
          ),
          slowNetworkPolicyAction: SlowNetworkPolicyAction.wait(
            Duration.seconds(2)
          ),
        })
      )
    );

  const handlePut = () =>
    runRequest('PUT /users/1', () =>
      jsonPlaceholderClient.put(
        new RequestOptions({
          url: '/users/1',
          body: RequestBody.createBytes(
            new TextEncoder().encode(
              JSON.stringify({ name: 'Sinem', job: 'mobile developer' })
            )
          ),
          offlinePolicyAction: OfflinePolicyAction.retry(
            3,
            Duration.seconds(4)
          ),
          slowNetworkPolicyAction: SlowNetworkPolicyAction.wait(
            Duration.seconds(2)
          ),
        })
      )
    );

  const handleDelete = () =>
    runRequest('DELETE /users/1', () =>
      jsonPlaceholderClient.delete(
        new RequestOptions({
          url: '/users/1',
          offlinePolicyAction: OfflinePolicyAction.retry(
            3,
            Duration.seconds(4)
          ),
          slowNetworkPolicyAction: SlowNetworkPolicyAction.wait(
            Duration.seconds(2)
          ),
        })
      )
    );

  const handleGetImage = async () => {
    setLoading(true);
    setLastResult(null);
    setImageBase64(null);
    try {
      const options = new RequestOptions({
        url: '/image',
        offlinePolicyAction: OfflinePolicyAction.queue(),
        cancelOnDispose: true,
        slowNetworkPolicyAction: SlowNetworkPolicyAction.wait(
          Duration.seconds(2)
        ),
      });

      const buffer: number[] = [];
      for await (const chunk of mainClient.getStream(options)) {
        buffer.push(...chunk);
      }
      const arrayBuffer = Uint8Array.from(buffer).buffer;
      setImageBase64(encode(arrayBuffer));
      setLastResult({
        label: 'GET /image (stream)',
        statusCode: 200,
        data: `${buffer.length} bytes received`,
      });
    } catch (e: any) {
      setLastResult({
        label: 'GET /image (stream)',
        error: e?.message ?? String(e),
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.didCancel || !result.assets?.[0]) return;

    const asset = result.assets[0];
    const uri = asset.uri!;
    const fileName = asset.fileName ?? 'photo.jpg';
    const type = asset.type ?? 'image/jpeg';

    setLoading(true);
    setLastResult(null);
    try {
      const imageResponse = await fetch(uri);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);

      const options = new RequestOptions({
        url: '/upload',
        body: RequestBody.multipart([
          RequestBodyPart.file('image', fileName, bytes, type),
        ]),
        offlinePolicyAction: OfflinePolicyAction.retry(3, Duration.seconds(4)),
        slowNetworkPolicyAction: SlowNetworkPolicyAction.wait(
          Duration.seconds(2)
        ),
      });

      const response = await mainClient.post(options);
      setLastResult({
        label: 'POST /upload',
        statusCode: response?.statusCode,
        data: JSON.stringify(response?.data),
      });
    } catch (e: any) {
      setLastResult({ label: 'POST /upload', error: e?.message ?? String(e) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Netra SDK Example</Text>
      </View>

      <View style={styles.buttonRow}>
        <ActionButton label="GET" onPress={handleGet} disabled={loading} />
        <ActionButton label="POST" onPress={handlePost} disabled={loading} />
        <ActionButton label="PUT" onPress={handlePut} disabled={loading} />
        <ActionButton
          label="DELETE"
          onPress={handleDelete}
          disabled={loading}
        />
        <ActionButton
          label="GET Image"
          onPress={handleGetImage}
          disabled={loading}
        />
        <ActionButton
          label="POST Image"
          onPress={handlePostImage}
          disabled={loading}
        />
      </View>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.content}>
        {lastResult && <ResultCard result={lastResult} />}

        {imageBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        {loading && !imageBase64 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6750A4" />
          </View>
        )}
        {snackbar && (
          <Animated.View
            style={[
              styles.snackbar,
              { backgroundColor: snackbar.color },
              {
                opacity: snackbarAnim,
                transform: [
                  {
                    translateY: snackbarAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.snackbarText}>{snackbar.message}</Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

function ResultCard({ result }: { result: RequestResult }) {
  const isSuccess = !result.error;
  const color = isSuccess ? '#2E7D32' : '#C62828';
  const bgColor = isSuccess ? 'rgba(46,125,50,0.06)' : 'rgba(198,40,40,0.06)';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bgColor, borderColor: color + '4D' },
      ]}
    >
      <Text style={styles.cardLabel}>{result.label}</Text>

      {result.statusCode != null && (
        <ResultRow
          label="Status"
          value={String(result.statusCode)}
          valueColor={color}
        />
      )}
      {result.data != null && <ResultRow label="Data" value={result.data} />}
      {result.error != null && (
        <ResultRow label="Error" value={result.error} valueColor="#C62828" />
      )}
    </View>
  );
}

function ResultRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.resultRow}>
      <Text style={styles.resultLabel}>{label}:</Text>
      <Text
        style={[styles.resultValue, valueColor ? { color: valueColor } : null]}
        numberOfLines={4}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#EADDFF',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#21005D' },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  divider: { height: 1, backgroundColor: '#E0E0E0' },
  content: { padding: 16, flexGrow: 1 },
  button: {
    backgroundColor: '#E8DEF8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  buttonPressed: { backgroundColor: '#D8C9EE' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#21005D', fontWeight: '600', fontSize: 13 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  cardLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: '#1C1B1F',
  },
  resultRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  resultLabel: { width: 52, fontSize: 12, color: '#757575', fontWeight: '500' },
  resultValue: { flex: 1, fontSize: 12, color: '#424242' },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  snackbar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 8,
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: 'gray',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  snackbarText: { color: '#009688', fontSize: 13 },
});
