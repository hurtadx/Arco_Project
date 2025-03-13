/**
 * Este script es necesario para manejar la configuración de electron
 * y resolver conflictos entre ES modules y CommonJS
 */
module.exports = {
  appId: "com.arcoapp.electron",
  files: [
    "dist/**/*",
    "electron/**/*"
  ],
  directories: {
    buildResources: "assets"
  },
  win: {
    asar: true,
    asarUnpack: "**\\*.{node,dll}",
    artifactName: "${productName}-${version}-setup.${ext}"
  }
};