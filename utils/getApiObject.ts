import { ApiNamespace } from '../model/api';

const getApiObjectText = (namespace: ApiNamespace, level = 0): string => {
  const { key, methods, namespaces } = namespace;
  const lines: string[] = [
    `${Array(level * 2)
      .fill(' ')
      .join('')}${!level ? 'const ' : ''}${key}${!level ? ' =' : ':'} {`,
  ];
  if (namespaces.length) {
    lines.push(...namespaces.map(n => getApiObjectText(n, level + 1)));
  }
  if (methods.length) {
    lines.push(
      ...methods.map((m): string => {
        return `${Array((level + 1) * 2)
          .fill(' ')
          .join('')}${
          m.key === m.methodName ? m.key : `${m.key}: ${m.methodName}`
        },`;
      }),
    );
  }
  lines.push(
    `${Array(level * 2)
      .fill(' ')
      .join('')}}${level ? ',' : ';'}`,
  );
  return lines.join('\n');
};

export default getApiObjectText;
