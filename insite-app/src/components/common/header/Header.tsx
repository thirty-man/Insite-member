import styled from "styled-components";

const HeaderContainer = styled.div`
  position: fixed;
  width: 100vw;
  height: 20vh;
  top: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  font-weight: 900;
  background-color: ${(props) => props.theme.colors.b1};
`;

function Header() {
  return (
    <HeaderContainer>
      <div>헤더</div>
    </HeaderContainer>
  );
}

export default Header;
