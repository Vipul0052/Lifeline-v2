// Type shims for JS modules and React default import
declare module '*.png';
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}
declare module '../styles/colors' {
  export const colors: any;
  export const getStatusColor: (status: string) => string;
  const _default: any;
  export default _default;
}
declare module '../styles/commonStyles' {
  export const commonStyles: any;
  const _default: any;
  export default _default;
}
