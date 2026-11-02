/** Photo library used across the portal.
 *
 *  Files are served from `public/photos/` so a presentation or an offline
 *  demo never depends on an external CDN being reachable.
 */
export const PHOTOS = {
  studentsLinear: "1523240795612-9a054b0db644",
  classroom: "1524178232363-1fb2b075b655",
  groupStudy: "1543269865-cbf427effbad",
  meeting: "1517048676732-d65bc937f952",
  takeoff: "1436491865332-7a61a109cc05",
  travel: "1488646953014-85cb44e25828",
  collaboration: "1522202176988-66273c2fd55f",
  workshop: "1552664730-d307ca884978",
  lab: "1581092918056-0c4c3acd3789",
  medical: "1576091160399-112ba8d25d1d",
  law: "1589829545856-d10d557cf95f",
  business: "1454165804606-c3d57bc86b40",
  campus: "1562774053-701939374585",
  library: "1521737604893-d14cc237f11d",
  lecture: "1541339907198-e08756dedf3f",
  studentLaptop: "1571260899304-425eee4c7efc",
  notes: "1517245386807-bb43f82c33c4"
} as const;

export function photo(id: string, _width = 800, _height?: number) {
  return `/photos/${id}.jpg`;
}