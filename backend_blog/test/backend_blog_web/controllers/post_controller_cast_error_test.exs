defmodule BackendBlogWeb.PostControllerCastErrorTest do
  use BackendBlogWeb.ConnCase
  
  describe "show action with invalid IDs (no auth)" do
    setup %{conn: conn} do
      {:ok, conn: put_req_header(conn, "accept", "application/json")}
    end
    
    test "returns 400 for non-numeric ID in show_published action", %{conn: conn} do
      conn = get(conn, ~p"/api/posts_published/not-a-number")
      
      assert json_response(conn, 400) == %{"error" => "Invalid post ID format"}
    end
  end
  
  describe "show action with invalid IDs (with auth)" do
    setup %{conn: conn} do
      # Create a user manually for the test
      user_attrs = %{
        email: "test@example.com",
        password: "password123"
      }
      {:ok, user} = BackendBlog.Accounts.create_user(user_attrs)
      {:ok, token, _} = BackendBlog.Guardian.encode_and_sign(user)
      
      conn = 
        conn
        |> put_req_header("accept", "application/json")
        |> put_req_header("authorization", "Bearer #{token}")
        
      {:ok, conn: conn, user: user}
    end
    
    test "returns 400 for non-numeric ID in show action", %{conn: conn} do
      conn = get(conn, ~p"/api/posts/not-a-number")
      
      assert json_response(conn, 400) == %{"error" => "Invalid post ID format"}
    end
    
    test "returns 400 for non-numeric ID in update action", %{conn: conn} do
      conn = put(conn, ~p"/api/posts/not-a-number", %{
        "post" => %{
          "title" => "Updated Title",
          "body" => "Updated Body"
        }
      })
      
      assert json_response(conn, 400) == %{"error" => "Invalid post ID format"}
    end
    
    test "returns 400 for non-numeric ID in delete action", %{conn: conn} do
      conn = delete(conn, ~p"/api/posts/not-a-number")
      
      assert json_response(conn, 400) == %{"error" => "Invalid post ID format"}
    end
    
    test "my_posts endpoint works without crashing", %{conn: conn} do
      # Just verify the endpoint doesn't crash with a cast error
      conn = get(conn, ~p"/api/posts/my-posts")
      
      # Should return 200 (not 400 or 500)
      assert response(conn, 200)
    end
  end
end
