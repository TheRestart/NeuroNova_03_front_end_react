/**
 * OHIF Viewer Configuration
 * Django Proxy를 통한 Orthanc DICOM-Web 접근 설정
 */

const DICOM_WEB_ROOT = process.env.REACT_APP_DICOM_WEB_ROOT || 'http://localhost:8000/api/ris/dicom-web';

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
        wadoUriRoot: DICOM_WEB_ROOT,
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
};

export default ohifConfig;
