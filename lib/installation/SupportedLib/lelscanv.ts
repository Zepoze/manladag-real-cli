/// <reference path="./SupportedLib.d.ts" />

const description =
`Lisez Vos chapitres preférées simplement et rapidement !
Parution hebdomadaire 
  - One Piece
  - Dr Stone
  - My Hero Academia et plein d'autres !
Si vous rencontrer des problèmes récurrent avec cette librairie n'hésiter pas à me contacter via zepozeofcourse@gmail.com
Bonne lecture !
`

const Lib:SupportedLib = {
  name: 'Lelscanv',
  url: 'https://lelscans.net/lecture-ligne-one-piece.php',
  description: description + 'From https://github.com/Zepoze/manladag-lelscanv#readme',
  minVersion: '1.2.0',
  module: '@manladag/lelscanv',
  lang:['fr'],
  recommended:true,
  author: 'Zepoze'
}
export default Lib