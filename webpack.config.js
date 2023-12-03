const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    proxy: {
      '/api': 'http://localhost:5000', // 백엔드 서버 주소로 변경
    },
    static: path.resolve(__dirname, 'dist'),
    hot: true,
  },
  mode: 'production', // 추가: 프로덕션 모드로 설정
  optimization: {
    minimize: true, // 추가: 코드 최소화 활성화
  },
};