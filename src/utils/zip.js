// Currently passthrough: we already have a compressed archive (zipball/tarball)
export function packageRepo({ blob }) {
  return Promise.resolve(blob);
}
