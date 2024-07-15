import AddressInput from "../components/AddressInput";
import { DepositTable } from "../components/DepositTable";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2>Lender Page</h2>
      <AddressInput />
      <h4>My deposits</h4>
      <DepositTable />
    </div>
  );
}

export default DashboardPage;