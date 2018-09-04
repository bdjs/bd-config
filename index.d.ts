declare module 'bd-config'

declare function getConfig(root?: string): { [k: string]: any }

export default getConfig
