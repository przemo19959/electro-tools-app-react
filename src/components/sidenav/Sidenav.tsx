import styled from "@emotion/styled";

type SidenavProps = {
  open: boolean;
}

export const Sidenav = ({
  open,
}: SidenavProps) => {
  if (!open) return null;

  return (
    <StyledContainer>
      <div style={{ marginBottom: 16 }}>Home</div>
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 200px;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 48px);
`;