import { FC } from "react";
import { Location } from "@/types";

/**
 * @typedef {object} LocationsTableProps
 * @property locations - List of locations that will be shown in the table
 * @property onClickViewLocation - Function that will be called when the user clicks on the view button
 * @property onClickDeleteLocation - Function that will be called when the user clicks on the delete button
 */
interface LocationsTableProps {
  locations: Location[];
  onClickViewLocation: (location: Location) => void;
  onClickDeleteLocation: (location: Location) => void;
}

/**
 * Table that shows a list of locations, it will show the name of the location and two buttons, one to view the location
 * and another one to delete it.
 * The view button will call the onClickViewLocation function and the delete button will call the onClickDeleteLocation
 * function.
 *
 * @param {LocationsTableProps} props - Component props
 *
 * @constructor
 */
export const LocationsTable: FC<LocationsTableProps> = (props) => {
  return (
    <table className="table table-striped">
      <thead className="table-dark">
        <tr>
          <th>Location</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {props.locations.map((location) => {
          return (
            <tr key={location.cuid}>
              <td>{location.name}</td>
              <td className="actions">
                <div className="btn-group">
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => props.onClickViewLocation(location)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => props.onClickDeleteLocation(location)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
