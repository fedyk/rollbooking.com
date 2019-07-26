import { Salon } from "../types/salon";
import { attrs, escape } from "../helpers/html";
import { stringMapJoin } from "../helpers/string-map-join";

interface Props {
  salons: Salon[]
}

export const getAllSalonView = (props: Props) => `
  <div class="card">
    <div class="card-header bg-transparent">Salons</div>
    <ul class="list-group list-group-flush">
      ${stringMapJoin(props.salons, (salon) => `
        <li class="list-group-item d-flex flex-column">
          <a class="h6 mb-0 stretched-link" ${attrs({ href: `/s/${salon.alias}` })}>${escape(salon.name)}</a>
          <span class="text-muted">${salon.timezone}</span>
        </li>
      `)}
    </ul>
  </div>
`