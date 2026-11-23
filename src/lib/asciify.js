// One lazy entry so the glyph engine never blocks first paint; callers catch failures and the page stays plain HTML.
export const kit = () => import('asciify-engine/kit');
