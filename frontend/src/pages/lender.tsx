import { AddressInput } from "../components/AddressInput";
import { DepositTable } from "../components/DepositTable";
import { DepositForm } from "../components/DepositForm";

const LenderPage: React.FC = () => {
  return (
    <div>
      <h2>Lender Page</h2>
      <AddressInput />
      <DepositForm />
      <h4>My deposits</h4>
      <DepositTable />
    </div>
  );
}

export default LenderPage;