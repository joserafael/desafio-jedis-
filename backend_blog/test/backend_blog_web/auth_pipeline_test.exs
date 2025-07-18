defmodule BackendBlogWeb.AuthPipelineTest do
  use BackendBlogWeb.ConnCase
  
  describe "auth pipeline" do
    test "protected route returns 401 when no token is provided" do
      conn = build_conn()
      
      conn = post(conn, "/api/posts", %{
        "post" => %{
          "title" => "Test Post",
          "body" => "This is a test post body"
        }
      })
      
      assert json_response(conn, 401) == %{"error" => "Authentication required"}
    end
    
    test "protected route returns 401 when invalid token is provided" do
      conn = build_conn()
      |> put_req_header("authorization", "Bearer invalid_token")
      
      conn = post(conn, "/api/posts", %{
        "post" => %{
          "title" => "Test Post", 
          "body" => "This is a test post body"
        }
      })
      
      assert json_response(conn, 401)["error"] =~ "Invalid token"
    end
    
    test "public routes work without authentication" do
      conn = build_conn()
      
      conn = get(conn, "/api/posts")
      
      assert json_response(conn, 200)["data"] == []
    end
  end
end
