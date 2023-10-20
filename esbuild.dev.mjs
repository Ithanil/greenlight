import * as esbuild from 'esbuild';

// Fetch 'RELATIVE_URL_ROOT' ENV variable value while removing any trailing slashes.
const relativeUrlRoot = (process.env.RELATIVE_URL_ROOT || '').replace(/\/*$/, '');
// Determine whether SAML is used (OIDC takes precedence)
const useSAML = (process.env.SAML_ENTITY_ID && !process.env.OPENID_CONNECT_ISSUER);

await esbuild.build({
  entryPoints: ['app/javascript/main.jsx'],
  bundle: true,
  sourcemap: true,
  outdir: 'app/assets/builds',
  loader: {
    '.png': 'dataurl',
    '.svg': 'text',
  },
  watch: {
    onRebuild: (error, result) => {
      if (error) console.error('watch build failed:', error);
      else console.log('watch build succeeded:', result);
    },
  },
  define: {
    'process.env.RELATIVE_URL_ROOT': `"${relativeUrlRoot}"`,
    'process.env.OMNIAUTH_PATH': useSAML ? `"${relativeUrlRoot}/auth/saml"` : `"${relativeUrlRoot}/auth/openid_connect"`,
  },
});

console.log('watch build started');
