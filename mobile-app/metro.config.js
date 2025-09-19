const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Ensure Metro resolves React and RN from this app only (avoid duplicate React copies)
config.resolver = {
  ...config.resolver,
  disableHierarchicalLookup: true,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
  ],
  extraNodeModules: {
    react: path.resolve(projectRoot, 'node_modules/react'),
    'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  },
};

// Watch the monorepo root but resolve modules from app first
config.watchFolders = [workspaceRoot];

module.exports = config;
