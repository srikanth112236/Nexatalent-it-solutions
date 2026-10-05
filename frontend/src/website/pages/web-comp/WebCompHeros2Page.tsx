import * as B from '../../components/web-comp/WcHeros2';
import { ScrollProgressBar } from '../../components/web-comp/WcSections';

const all = [B.H12Blob, B.H13Collage, B.H14GiantType, B.H15Browser, B.H16Badges];

export function WebCompHeros2Page() {
  return (
    <div className="bg-white">
      <ScrollProgressBar />
      {all.map((C, i) => <C key={i} />)}
    </div>
  );
}
