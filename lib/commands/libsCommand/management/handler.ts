export default async function(argv: {
    [argName: string]: unknown;
    _: string[];
    $0: string;
}) {
  require('../../../installation/manladagLib')
}