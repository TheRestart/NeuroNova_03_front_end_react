/**
 * OHIF Viewer Configuration
 * Django Proxy를 통한 Orthanc DICOM-Web 접근 설정
 */

const DICOM_WEB_ROOT = process.env.REACT_APP_DICOM_WEB_ROOT || 'http://localhost:8000/api/ris/pacs/dicom-web';

const ohifConfig = {
  routerBasename: '/',
  extensions: [],
  modes: [],
  showStudyList: true,
  // DICOM Web 데이터 소스 설정 (Django Proxy 경유)
  dataSources: [
    {
      friendlyName: 'NeuroNova PACS (via Django)',
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'dicomweb',
      configuration: {
        name: 'NeuroNova',
        wadoUriRoot: process.env.REACT_APP_WADO_URI_ROOT || 'http://localhost:8000/api/ris/wado',
        qidoRoot: DICOM_WEB_ROOT,
        wadoRoot: DICOM_WEB_ROOT,
        qidoSupportsIncludeField: false,
        supportsReject: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: false,
        supportsWildcard: true,
        staticWado: true,
        singlepart: 'bulkdata,video',
        // JWT 토큰을 헤더에 자동 추가
        requestOptions: {
          requestHeaders: () => {
            const token = localStorage.getItem('access_token');
            return {
              Authorization: token ? `Bearer ${token}` : '',
            };
          },
        },
      },
    },
  ],
  defaultDataSourceName: 'dicomweb',
  // WASM 디코더 설정 (HTJ2K 지원)
  customizationService: {
    dicomUploadComponent:
      '@ohif/extension-cornerstone.customizationModule.cornerstoneDicomUploadComponent',
    cornerstoneOverlayViewportTools: [
      {
        name: 'ScaleOverlay',
        label: 'Scale',
        props: {
          configuration: {
            viewportId: 'CORNERSTONE_VIEWPORT',
          },
        },
      },
    ],
  },
  // HTJ2K WASM 디코더 경로 설정
  // public/wasms 디렉토리에 .wasm 파일 위치 필요
  decoderConfig: {
    decodeConfig: {
      use16BitDataType: true,
    },
    loaderConfig: {
      webWorkerTaskPaths: [
        '/wasms/imageLoader/cornerstoneWADOImageLoaderWebWorker.min.js',
      ],
      taskConfiguration: {
        decodeTask: {
          initializeCodecsOnStartup: false,
          usePDFJS: false,
          strict: false,
        },
      },
    }
  },
};

export default ohifConfig;
