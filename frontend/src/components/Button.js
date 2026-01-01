import styled from "styled-components";

export const Button = styled.button`
  border-radius: 50px;
  background: ${({ primary }) => (primary ? "#555b83" : "#9da1e7")};
  white-space: nowrap;
  padding: ${({ big }) => (big ? "14px 48px" : "12px 30px")};
  color: #f7f0ff;
  font-size: ${({ fontBig }) => (fontBig ? "20px" : "16px")};
  outline: none;
  border: none;
  cursor: pointer;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    color: #f7f0ff;
    background: ${({ primary }) => (primary ? "#98a1cf" : "#555b83")};
  }
`;
