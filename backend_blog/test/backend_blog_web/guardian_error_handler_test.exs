defmodule BackendBlogWeb.GuardianErrorHandlerTest do
  use BackendBlogWeb.ConnCase
  
  alias BackendBlogWeb.GuardianErrorHandler
  
  describe "auth_error/3" do
    test "returns proper JSON error for unauthenticated" do
      conn = build_conn()
      
      result = GuardianErrorHandler.auth_error(conn, {:unauthenticated, "No token provided"}, [])
      
      assert result.status == 401
      assert result.resp_body == Jason.encode!(%{error: "Authentication required"})
      assert get_resp_header(result, "content-type") == ["application/json; charset=utf-8"]
      assert result.halted == true
    end
    
    test "returns proper JSON error for invalid token" do
      conn = build_conn()
      
      result = GuardianErrorHandler.auth_error(conn, {:invalid_token, "Bad token"}, [])
      
      assert result.status == 401
      assert result.resp_body == Jason.encode!(%{error: "Invalid token"})
    end
    
    test "returns proper JSON error for expired token" do
      conn = build_conn()
      
      result = GuardianErrorHandler.auth_error(conn, {:token_expired, "Token expired"}, [])
      
      assert result.status == 401
      assert result.resp_body == Jason.encode!(%{error: "Token expired"})
    end
    
    test "returns generic error for unknown error types" do
      conn = build_conn()
      
      result = GuardianErrorHandler.auth_error(conn, {:unknown_error, "Something went wrong"}, [])
      
      assert result.status == 401
      assert result.resp_body == Jason.encode!(%{error: "Authentication failed"})
    end
  end
end
