const labels = {
  warning: '[WARNING mobx-from-store]',
  error: '[ERROR mobx-from-store]'
};

export const missingProcessRequest = `
${labels.warning} processRequest method is not defined or not a function.
This method allows you to call submit() on the form. Read thru the
documentation http://example.com for examles and information about this.
`;
