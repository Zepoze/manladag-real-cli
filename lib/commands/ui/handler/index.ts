import server from './lib/expressApp'
export default function(argv: {
    [argName: string]: unknown;
    _: string[];
    $0: string;
}) {
    console.log('ui')
    server.listen(4000,function() {
        console.log('ui is listening')
    })
}